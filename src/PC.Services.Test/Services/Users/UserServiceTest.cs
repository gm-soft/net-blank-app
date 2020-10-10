using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Company.Core.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using PC.Database;
using PC.Database.Models.Users;
using PC.Database.Repositories.Tests.Utils;
using PC.Database.Repositories.Users;
using PC.Domain.Test.Services.Email;
using PC.Models.Users;
using PC.Services.Auth;
using PC.Services.Email;
using PC.Services.User;
using TestUtils.Auth;
using TestUtils.EntityFactories;
using TestUtils.Mappings;
using Utils.Enums;
using Utils.Exceptions;
using Xunit;

namespace PC.Domain.Test.Services.Users
{
    public class UserServiceTest
    {
        private readonly IConfigurationRoot _config;

        public UserServiceTest()
        {
            AutomapperSingleton.Initialize();

            _config = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    { "baseUrl", "Value1" }
                })
                .Build();
        }

        [Fact]
        public async Task GetAllAsync_WithRoles_OkAsync()
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);

                var user1 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
                var user2 = await new ApplicationUserFactory(Role.HRManager).BuildAsync(userRepo);
                var user3 = await new ApplicationUserFactory(Role.TopManager).BuildAsync(userRepo);

                var target = Target(context, new AuthManagerMockHelper(Role.SystemAdministrator).GetManager());

                var users = await target.GetAllAsync();

                Assert.NotEmpty(users);
                Assert.Equal(3, users.Count);

                Assert.Equal(Role.Employee, users.ElementAt(0).Role);
                Assert.Equal(Role.HRManager, users.ElementAt(1).Role);
                Assert.Equal(Role.TopManager, users.ElementAt(2).Role);
            }
        }

        [Fact]
        public async Task Delete_TryToDeleteMyself_ExceptionAsync()
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);

                var userToDelete = await new ApplicationUserFactory(Role.SystemAdministrator).BuildAsync(userRepo);

                var service = Target(context, new AuthManagerMockHelper(userToDelete).GetManager());

                await Assert.ThrowsAsync<BadRequestException>(() => service.DeleteAsync(userToDelete.Id));
            }
        }

        [Fact]
        public async Task Delete_AnotherUser_OkAsync()
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);

                var userToDelete = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
                var anotherUser = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);

                var service = Target(context, new AuthManagerMockHelper(Role.HRManager).GetManager());
                await service.DeleteAsync(userToDelete.Id);

                IReadOnlyCollection<ApplicationUser> activeUsers = await service.GetAllAsync();

                Assert.Single(activeUsers);
                Assert.True(activeUsers.All(x => x.DeletedAt == null));
                Assert.Equal(anotherUser.Id, activeUsers.First().Id);

                IReadOnlyCollection<ApplicationUser> inactiveUsers = await userRepo.InactiveUsersAsync();

                Assert.NotEmpty(inactiveUsers);
                Assert.Single(inactiveUsers);

                var inactiveUser = inactiveUsers.First();

                Assert.Equal(userToDelete.Id, inactiveUser.Id);
            }
        }

        [Fact]
        public async Task Delete_TryToDeleteNotExistingUser_ExceptionAsync()
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var service = Target(context, new AuthManagerMockHelper(Role.HRManager).GetManager());

                Assert.Empty(await context.Users.ToArrayAsync());

                await Assert.ThrowsAsync<ResourceNotFoundException>(() => service.DeleteAsync(1));
            }
        }

        private UserService Target(DatabaseContext context, IAuthorizationManager auth)
        {
            return new UserService(
                userRepository: new UserRepository(context, AutomapperSingleton.Mapper),
                authorizationManager: auth,
                emailDomainValidatorService: new EmailDomainValidatorService("gmail.com|hipo.kz"),
                emailSender: new EmailSender(new SendGridClientFake()),
                viewRenderer: new ViewRendererFake(),
                baseUrls: new BaseUrls(_config));
        }

        [Fact]
        public async Task ImportAsync_CollectionContainsUniqueUsers_OkAsync()
        {
            var listOfUsers = new List<ApplicationUser>
            {
                CreateAppUserForImport("John", "Smith", "j.smith@gmail.com"),
                CreateAppUserForImport("Vasya", "Pupkin", "v.pupkin@gmail.com"),
                CreateAppUserForImport("Petya", "Ivanov", "p.ivanov@gmail.com"),
                CreateAppUserForImport("Elena", "Golovach", "e.golovach@gmail.com"),
            };

            await ArrangeAndAssertValidSituationsAsync(listOfUsers);
        }

        [Fact]
        public async Task ImportAsync_CollectionContainsUniqueUsers_DirtyData_OkAsync()
        {
            var listOfUsers = new List<ApplicationUser>
            {
                CreateAppUserForImport("John ", " Smith", " j.smith@gmail.com"),
                CreateAppUserForImport(" Vasya", "Pupkin ", "v.pupkin@gmail.com "),
                CreateAppUserForImport("  Petya  ", "  Ivanov  ", "  p.ivanov@gmail.com  "),
                CreateAppUserForImport("   Elena   ", "   Golovach   ", "   e.golovach@gmail.com   "),
            };

            await ArrangeAndAssertValidSituationsAsync(listOfUsers);
        }

        private async Task ArrangeAndAssertValidSituationsAsync(List<ApplicationUser> listOfUsers)
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);

                var listOfUsersToImport = listOfUsers.ToArray();

                var service = Target(context, new Mock<IAuthorizationManager>().Object);

                int count = await service.ImportAsync(listOfUsersToImport);

                Assert.True(count > 0);
                Assert.Equal(listOfUsersToImport.Length, count);

                var importedUsers = await userRepo.GetAllAsync();
                Assert.Equal(count, importedUsers.Count);

                foreach (ApplicationUser importedUser in importedUsers)
                {
                    Assert.Equal(importedUser.Email, importedUser.Email.Trim());
                    Assert.Equal(importedUser.UserName, importedUser.UserName.Trim());
                    Assert.Equal(importedUser.FirstName, importedUser.FirstName.Trim());
                    Assert.Equal(importedUser.LastName, importedUser.LastName.Trim());
                    Assert.Equal(Role.Employee, importedUser.Role);
                }
            }
        }

        [Fact]
        public async Task ImportAsync_DatabaseContainsNotUniqueUsers_OkAsync()
        {
            var listOfUsers = new List<ApplicationUser>
            {
                CreateAppUserForImport("John", "Smith", "j.smith@gmail.com"),
            };

            var listOfUsersToImport = listOfUsers.ToArray();

            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                await context.Users.AddAsync(new DbUser
                {
                    FirstName = "John",
                    LastName = "Smith",
                    Email = "j.smith@gmail.com"
                });

                await context.SaveChangesAsync();

                Assert.Equal(1, await context.Users.CountAsync());

                var service = Target(context, new Mock<IAuthorizationManager>().Object);

                Assert.Equal(0, await service.ImportAsync(listOfUsersToImport));

                Assert.Equal(1, await context.Users.CountAsync());
            }
        }

        [Fact]
        public async Task ImportAsync_CollectionContainsNotUniqueUsers_ExceptionAsync()
        {
            var listOfUsers = new List<ApplicationUser>
            {
                CreateAppUserForImport("John", "Smith", "j.smith@gmail.com"),
                CreateAppUserForImport("John1", "Smith1", "j.smith@gmail.com"),
            };

            var listOfUsersToImport = listOfUsers.ToArray();

            var userRepoMock = new Mock<IUserRepository>();
            userRepoMock
                .Setup(x => x.CheckHasUserWithEmailAsync(It.IsAny<string>()))
                .Returns<string>(emailToCheck =>
                {
                    // To check that all emails were passed to this method
                    listOfUsers = listOfUsers.Where(x => x.Email.Trim() != emailToCheck).ToList();
                    return Task.FromResult(false);
                });

            userRepoMock
                .Setup(x => x.InsertAsync(It.IsAny<IReadOnlyCollection<ApplicationUser>>()))
                .Returns<IReadOnlyCollection<ApplicationUser>>((usersToInsert)
                    => throw new InvalidOperationException("Should not be invoked"));

            var service = new UserService(
                userRepository: userRepoMock.Object,
                authorizationManager: new Mock<IAuthorizationManager>().Object,
                emailDomainValidatorService: new EmailDomainValidatorService("gmail.com|hipo.kz"),
                emailSender: new EmailSender(new SendGridClientFake()),
                viewRenderer: new ViewRendererFake(),
                baseUrls: new BaseUrls(_config));

            await Assert.ThrowsAsync<BadRequestException>(() => service.ImportAsync(listOfUsersToImport));
        }

        [Fact]
        public async Task ImportAsync_NullCollection_ExceptionAsync()
        {
            var service = new UserService(
                userRepository: new Mock<IUserRepository>().Object,
                authorizationManager: new Mock<IAuthorizationManager>().Object,
                emailDomainValidatorService: new EmailDomainValidatorService("gmail.com|hipo.kz"),
                emailSender: new EmailSender(new SendGridClientFake()),
                viewRenderer: new ViewRendererFake(),
                baseUrls: new BaseUrls(_config));

            await Assert.ThrowsAsync<ArgumentNullException>(() => service.ImportAsync(null));
        }

        [Fact]
        public async Task ImportAsync_WrongDomain_ExceptionAsync()
        {
            var listOfUsers = new List<ApplicationUser>
            {
                CreateAppUserForImport("John", "Smith", "j.smith@gmail.comi")
            };

            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var listOfUsersToImport = listOfUsers.ToArray();

                var service = new UserService(
                    userRepository: new UserRepository(context, AutomapperSingleton.Mapper),
                    authorizationManager: new Mock<IAuthorizationManager>().Object,
                    emailDomainValidatorService: new EmailDomainValidatorService("gmail.com|hipo.kz"),
                    emailSender: new EmailSender(new SendGridClientFake()),
                    viewRenderer: new ViewRendererFake(),
                    baseUrls: new BaseUrls(_config));

                await Assert.ThrowsAsync<BadRequestException>(() => service.ImportAsync(listOfUsersToImport));
            }
        }

        [Fact]
        public async Task ImportAsync_EmptyCollection_ExceptionAsync()
        {
            var service = new UserService(
                userRepository: new Mock<IUserRepository>().Object,
                authorizationManager: new Mock<IAuthorizationManager>().Object,
                emailDomainValidatorService: new EmailDomainValidatorService("gmail.com|hipo.kz"),
                emailSender: new EmailSender(new SendGridClientFake()),
                viewRenderer: new ViewRendererFake(),
                baseUrls: new BaseUrls(_config));

            await Assert.ThrowsAsync<BadRequestException>(() => service.ImportAsync(new List<ApplicationUser>()));
        }

        [Fact]
        public async Task InsertAsync_Null_ExceptionAsync()
        {
            var service = new UserService(
                userRepository: new Mock<IUserRepository>().Object,
                authorizationManager: new Mock<IAuthorizationManager>().Object,
                emailDomainValidatorService: new EmailDomainValidatorService("gmail.com|hipo.kz"),
                emailSender: new EmailSender(new SendGridClientFake()),
                viewRenderer: new ViewRendererFake(),
                baseUrls: new BaseUrls(_config));

            await Assert.ThrowsAsync<ArgumentNullException>(() => service.InsertAsync(null));
        }

        [Fact]
        public async Task InsertAsync_WrongDomain_ExceptionAsync()
        {
            var user = CreateAppUserForImport("John", "Smith", "j.smith@gmail.comi");

            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var service = Target(context, new Mock<IAuthorizationManager>().Object);

                await Assert.ThrowsAsync<BadRequestException>(() => service.InsertAsync(user));
            }
        }

        [Theory]
        [InlineData(Role.SystemAdministrator)]
        [InlineData(Role.TopManager)]
        [InlineData(Role.HRManager)]
        public async Task InsertAsync_NoFunctionalManager_OkAsync(Role currentUserRole)
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                IAuthorizationManager authMock = new AuthManagerMockHelper(currentUserRole).GetManager();

                var service = Target(context, authMock);

                ApplicationUser user = await service.GetByIdAsync(
                    await service.InsertAsync(
                        CreateAppUserForImport("John", "Test", "j.test@gmail.com")));

                Assert.Equal(Role.Employee, user.Role);
                Assert.Equal("John", user.FirstName);
                Assert.Equal("Test", user.LastName);
                Assert.Equal("j.test@gmail.com", user.UserName);
                Assert.Equal("j.test@gmail.com", user.Email);
            }
        }

        private static ApplicationUser CreateAppUserForImport(string firstName, string lastName, string email)
        {
            return new ApplicationUser
            {
                Email = email,
                UserName = email,
                FirstName = firstName,
                LastName = lastName
            };
        }

        [Fact]
        public async Task UpdateAsync_RoleTheSame_RoleDidntChanged_OkAsync()
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);
                var userInDb = await new ApplicationUserFactory(
                    role: Role.Employee,
                    firstName: "Neo",
                    lastName: "Tom",
                    email: "n.tom@gmail.com")
                    .BuildAsync(userRepo);

                var newUserData = new ApplicationUser
                {
                    Id = userInDb.Id,
                    FirstName = userInDb.FirstName + "1",
                    LastName = userInDb.LastName + "1",
                    UserName = userInDb.UserName + "1",
                    Email = userInDb.Email + "1",
                    Role = Role.Employee
                };

                var target = new UserService(
                    userRepository: userRepo,
                    authorizationManager: new AuthManagerMockHelper(Role.SystemAdministrator).GetManager(),
                    emailDomainValidatorService: new EmailDomainValidatorService("gmail.com|hipo.kz"),
                    emailSender: new EmailSender(new SendGridClientFake()),
                    viewRenderer: new ViewRendererFake(),
                    baseUrls: new BaseUrls(_config));

                await target.UpdateAsync(newUserData);

                userInDb = await target.GetByIdAsync(userInDb.Id);

                // was changed
                Assert.Equal("Neo1", userInDb.FirstName);
                Assert.Equal("Tom1", userInDb.LastName);

                // Was not changed
                Assert.Equal("n.tom@gmail.com", userInDb.Email);
                Assert.Equal("n.tom@gmail.com", userInDb.UserName);

                Assert.Equal(Role.Employee, userInDb.Role);
            }
        }

        [Fact]
        public async Task UpdateAsync_SysAdminChangesRoleForOtherUser_OkAsync()
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);
                var userInDb = await new ApplicationUserFactory(
                        role: Role.Employee,
                        firstName: "Neo",
                        lastName: "Tom",
                        email: "n.tom@gmail.com")
                    .BuildAsync(userRepo);

                var newUserData = new ApplicationUser
                {
                    Id = userInDb.Id,
                    FirstName = userInDb.FirstName + "1",
                    LastName = userInDb.LastName + "1",
                    UserName = userInDb.UserName + "1",
                    Email = userInDb.Email + "1",
                    Role = Role.HRManager
                };

                var target = new UserService(
                    userRepository: userRepo,
                    authorizationManager: new AuthManagerMockHelper(Role.SystemAdministrator).GetManager(),
                    emailDomainValidatorService: new EmailDomainValidatorService("gmail.com|hipo.kz"),
                    emailSender: new EmailSender(new SendGridClientFake()),
                    viewRenderer: new ViewRendererFake(),
                    baseUrls: new BaseUrls(_config));

                await target.UpdateAsync(newUserData);

                userInDb = await target.GetByIdAsync(userInDb.Id);

                // was changed
                Assert.Equal("Neo1", userInDb.FirstName);
                Assert.Equal("Tom1", userInDb.LastName);

                // Was not changed
                Assert.Equal("n.tom@gmail.com", userInDb.Email);
                Assert.Equal("n.tom@gmail.com", userInDb.UserName);

                Assert.Equal(Role.HRManager, userInDb.Role);
            }
        }

        [Fact]
        public async Task UpdateAsync_EmployeeTriesToChangeRole_ExceptionAsync()
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);
                var userInDb = await new ApplicationUserFactory(
                        role: Role.Employee,
                        firstName: "Neo",
                        lastName: "Tom",
                        email: "n.tom@gmail.com")
                    .BuildAsync(userRepo);

                var newUserData = new ApplicationUser
                {
                    Id = userInDb.Id,
                    FirstName = userInDb.FirstName + "1",
                    LastName = userInDb.LastName + "1",
                    UserName = userInDb.UserName + "1",
                    Email = userInDb.Email + "1",
                    Role = Role.HRManager
                };

                var target = new UserService(
                    userRepository: userRepo,
                    authorizationManager: new AuthManagerMockHelper(Role.Employee).GetManager(),
                    emailDomainValidatorService: new EmailDomainValidatorService("gmail.com|hipo.kz"),
                    emailSender: new EmailSender(new SendGridClientFake()),
                    viewRenderer: new ViewRendererFake(),
                    baseUrls: new BaseUrls(_config));

                await Assert.ThrowsAsync<NoPermissionsException>(() => target.UpdateAsync(newUserData));
            }
        }

        [Theory]
        [InlineData(Role.TopManager)]
        [InlineData(Role.HRManager)]
        public async Task UpdateAsync_NotAdminLowerRole_ExceptionAsync(Role currentUserRole)
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);

                var user1 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
                var user2 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);

                IAuthorizationManager authMock = new AuthManagerMockHelper(Role.SystemAdministrator).GetManager();

                var service = Target(context, authMock);

                var user = CreateAppUserForImport("John", "Test", "j.test@gmail.com");
                long userId = await service.InsertAsync(user);
                var newUser = await service.GetByIdAsync(userId);

                newUser.Role = Role.SystemAdministrator;
                await service.UpdateAsync(newUser);

                authMock = new AuthManagerMockHelper(currentUserRole).GetManager();

                service = Target(context, authMock);
                newUser = await service.GetByIdAsync(userId);
                newUser.Role = Role.Employee;

                await Assert.ThrowsAsync<NoPermissionsException>(() => service.UpdateAsync(newUser));
            }
        }

        [Theory]
        [InlineData(Role.TopManager)]
        [InlineData(Role.HRManager)]
        public async Task UpdateAsync_NotAdminSetHigherRole_ExceptionAsync(Role currentUserRole)
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);

                var user1 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
                var user2 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);

                IAuthorizationManager authMock = new AuthManagerMockHelper(currentUserRole).GetManager();

                var service = Target(context, authMock);

                var user = CreateAppUserForImport("John", "Test", "j.test@gmail.com");
                long userId = await service.InsertAsync(user);
                var newUser = await service.GetByIdAsync(userId);

                newUser.Role = Role.SystemAdministrator;

                await Assert.ThrowsAsync<BadRequestException>(() => service.UpdateAsync(newUser));
            }
        }

        [Fact]
        public async Task UpdateAsync_AdminTriesToChangeHisRole_ExceptionAsync()
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                const string oldEmail = "old email";
                const string oldUsername = "old username";

                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);

                var userInDb = await new ApplicationUserFactory(Role.SystemAdministrator).BuildAsync(userRepo);

                var newUserData = new ApplicationUser
                {
                    Id = userInDb.Id,
                    FirstName = userInDb.FirstName + "1",
                    LastName = userInDb.LastName + "1",
                    UserName = oldUsername + "1",
                    Email = oldEmail + "1",
                    Role = Role.Employee
                };

                var target = new UserService(
                    userRepo,
                    new AuthManagerMockHelper(userInDb).GetManager(),
                    emailDomainValidatorService: new EmailDomainValidatorService("gmail.com|hipo.kz"),
                    emailSender: new EmailSender(new SendGridClientFake()),
                    viewRenderer: new ViewRendererFake(),
                    baseUrls: new BaseUrls(_config));

                await Assert.ThrowsAsync<BadRequestException>(() => target.UpdateAsync(newUserData));
            }
        }

        [Theory]
        [InlineData(Role.Employee)]
        [InlineData(Role.HRManager)]
        [InlineData(Role.TopManager)]
        [InlineData(Role.SystemAdministrator)]
        [InlineData(Role.System)]
        public async Task GetByIdAsync_UserReturnsWithRole_OkAsync(Role userRole)
        {
            using (DatabaseContext context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);

                var user = await new ApplicationUserFactory(userRole)
                    .BuildAsync(userRepo);

                var target = Target(context, new AuthManagerMockHelper(Role.HRManager).GetManager());

                user = await target.GetByIdAsync(user.Id);

                Assert.NotNull(user);
                Assert.Equal(userRole, user.Role);
            }
        }

        [Theory]
        [InlineData(Role.HRManager)]
        [InlineData(Role.TopManager)]
        [InlineData(Role.SystemAdministrator)]
        public async Task GetByIdAsync_OkAsync(Role currentUser)
        {
            using (DatabaseContext context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userRepo = new UserRepository(context, AutomapperSingleton.Mapper);

                var user = await new ApplicationUserFactory(Role.Employee)
                    .BuildAsync(userRepo);

                var target = Target(context, new AuthManagerMockHelper(currentUser).GetManager());

                user = await target.GetByIdAsync(user.Id);

                Assert.NotNull(user);
            }
        }
    }
}