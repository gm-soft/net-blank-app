using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Database;
using Database.Repositories.Users;
using Domain.Dtos.Users;
using Domain.Services.Auth;
using Domain.Services.Users;
using Microsoft.EntityFrameworkCore;
using Moq;
using PC.Database;
using PC.Database.Extensions;
using PC.Models.Users;
using TestUtils.Auth;
using TestUtils.Database;
using TestUtils.EntityFactories;
using TestUtils.Mappings;
using TestUtils.ServiceStubs;
using Utils.Dates;
using Utils.Enums;
using Utils.Exceptions;
using Utils.MathHelpers;
using Utils.Pagination;
using Utils.Validators;
using Xunit;

namespace PC.Domain.Test.Services.Users
{
    public class UserServiceTest
    {
        public UserServiceTest()
        {
            AutomapperSingleton.Initialize();
        }

        private async Task ConfirmEmailAsync(DatabaseContext context, long userId)
        {
            var dbUser = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            dbUser.EmailConfirmed = true;
            await context.SaveChangesAsync();
        }

        [Fact]
        public async Task SearchAsync_NoConfirmedUsers_WithRoles_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var target = Target(context, new FakeAuth(Role.SystemAdministrator));

            PageModel pageModel = new PageModel();

            var user = await new ApplicationUserFactory(
                    new FakeUser(
                        Role.Employee,
                        firstName: "user1_name",
                        lastName: "user1_surname",
                        userName: "1.surname@example.com"))
                .BuildAsync(context);

            var users = await target.SearchAsync("u", pageModel);

            Assert.Empty(users.Results);
        }

        [Fact]
        public async Task SearchAsync_ConfirmedUsers_WithRoles_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var target = Target(context, new FakeAuth(Role.SystemAdministrator));

            PageModel pageModel = new PageModel();

            var user = await new ApplicationUserFactory(
                    new FakeUser(
                        Role.Employee,
                        firstName: "user1_name",
                        lastName: "user1_surname",
                        userName: "1.surname@example.com"))
                .BuildAsync(context);

            await ConfirmEmailAsync(context, user.Id);

            var users = await target.SearchAsync("u", pageModel);

            Assert.NotEmpty(users.Results);
            Assert.Equal(Role.Employee, users.Results.First().Role);
        }

        [Fact]
        public async Task SearchAsync_NoUsers_WithRoles_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var target = Target(context, new FakeAuth(Role.SystemAdministrator));

            PageModel pageModel = new PageModel();

            var users = await target.SearchAsync("q", pageModel);

            Assert.Empty(users.Results);
        }

        [Fact]
        public async Task GetAllAsync_WithRoles_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var user1 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
            var user2 = await new ApplicationUserFactory(Role.HRManager).BuildAsync(userRepo);
            var user3 = await new ApplicationUserFactory(Role.TopManager).BuildAsync(userRepo);

            var target = Target(context, new FakeAuth(Role.SystemAdministrator));

            var users = await target.GetAllAsync();

            Assert.NotEmpty(users);
            Assert.Equal(3, users.Count);

            Assert.Equal(Role.Employee, users.ElementAt(0).Role);
            Assert.Equal(Role.HRManager, users.ElementAt(1).Role);
            Assert.Equal(Role.TopManager, users.ElementAt(2).Role);
        }

        [Fact]
        public async Task GetAllAsync_PaginatedList_PageModelIsNull_WithRoles_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var user1 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
            var user2 = await new ApplicationUserFactory(Role.HRManager).BuildAsync(userRepo);
            var user3 = await new ApplicationUserFactory(Role.TopManager).BuildAsync(userRepo);

            var target = Target(context, new FakeAuth(Role.SystemAdministrator));

            PageModel pageModel = new PageModel();
            var users = await target.GetAllAsync(pageModel);

            Assert.Equal(10, users.PageSize);
            Assert.Equal(1, users.CurrentPage);

            Assert.NotEmpty(users.Results);
            Assert.Equal(3, users.Results.Count);

            Assert.Equal(Role.Employee, users.Results.ElementAt(0).Role);
            Assert.Equal(Role.HRManager, users.Results.ElementAt(1).Role);
            Assert.Equal(Role.TopManager, users.Results.ElementAt(2).Role);
        }

        [Fact]
        public async Task GetAllAsync_PaginatedList_PageModelIsNotNull_WithRoles_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var user1 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
            var user2 = await new ApplicationUserFactory(Role.HRManager).BuildAsync(userRepo);
            var user3 = await new ApplicationUserFactory(Role.TopManager).BuildAsync(userRepo);

            var target = Target(context, new FakeAuth(Role.SystemAdministrator));

            PageModel pageModel = new PageModel() { Page = 2, PageSize = 2 };

            var users = await target.GetAllAsync(pageModel);

            Assert.NotEmpty(users.Results);
            Assert.Equal(1, users.Results.Count);

            Assert.Equal(Role.TopManager, users.Results.ElementAt(0).Role);
            Assert.Equal(2, users.PageSize);
            Assert.Equal(2, users.CurrentPage);

            pageModel = new PageModel() { Page = 2, PageSize = 3 };

            users = await target.GetAllAsync(pageModel);
            Assert.Empty(users.Results);
            Assert.Equal(3, users.PageSize);
            Assert.Equal(2, users.CurrentPage);
        }

        [Fact]
        public async Task GetAllAsync_PaginatedList_NoUsers_WithRoles_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var target = Target(context, new FakeAuth(Role.SystemAdministrator));

            PageModel pageModel = new PageModel();

            var users = await target.GetAllAsync(pageModel);

            Assert.Empty(users.Results);
        }

        [Fact]
        public async Task Delete_TryToDeleteMyself_ExceptionAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var userToDelete = await new ApplicationUserFactory(Role.SystemAdministrator).BuildAsync(userRepo);

            var service = Target(context, new FakeAuth(userToDelete));

            await Assert.ThrowsAsync<BadAssException>(() => service.DeleteAsync(userToDelete.Id));
        }

        [Fact]
        public async Task Delete_AnotherUser_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var userToDelete = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
            var anotherUser = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);

            var service = Target(context, new FakeAuth(Role.HRManager));
            await service.DeleteAsync(userToDelete.Id);

            IReadOnlyCollection<User> activeUsers = await service.GetAllAsync();

            Assert.Single(activeUsers);
            Assert.True(activeUsers.All(x => x.DeletedAt == null));
            Assert.Equal(anotherUser.Id, activeUsers.First().Id);

            IReadOnlyCollection<User> inactiveUsers = await userRepo.InactiveUsersAsync();

            Assert.NotEmpty(inactiveUsers);
            Assert.Single(inactiveUsers);

            var inactiveUser = inactiveUsers.First();

            Assert.Equal(userToDelete.Id, inactiveUser.Id);
        }

        [Fact]
        public async Task Delete_TryToDeleteNotExistingUser_ExceptionAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var service = Target(context, new FakeAuth(Role.HRManager));

            Assert.Empty(await context.Users.ToArrayAsync());

            await Assert.ThrowsAsync<ResourceNotFoundException>(() => service.DeleteAsync(1));
        }

        private UserService Target(DatabaseContext context, IAuthorizationManager auth)
        {
            return new UserService(
                userRepository: new UserRepository(context),
                authorizationManager: auth,
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: new UserEmailStub(),
                userEvent: new UserEventStub());
        }

        [Fact]
        public async Task ImportAsync_CollectionContainsUniqueUsers_OkAsync()
        {
            var listOfUsers = new List<UserDto>
            {
                new UserDto("John", "Smith", "j.smith@example.com"),
                new UserDto("Vasya", "Pupkin", "v.pupkin@example.com"),
                new UserDto("Petya", "Ivanov", "p.ivanov@example.com"),
                new UserDto("Elena", "Golovach", "e.golovach@example.com"),
            };

            await ArrangeAndAssertValidSituationsAsync(listOfUsers);
        }

        [Fact]
        public async Task ImportAsync_CollectionContainsUniqueUsers_DirtyData_OkAsync()
        {
            var listOfUsers = new List<UserDto>
            {
                new UserDto("John ", " Smith", " j.smith@example.com"),
                new UserDto(" Vasya", "Pupkin ", "v.pupkin@example.com "),
                new UserDto("  Petya  ", "  Ivanov  ", "  p.ivanov@example.com  "),
                new UserDto("   Elena   ", "   Golovach   ", "   e.golovach@example.com   "),
            };

            await ArrangeAndAssertValidSituationsAsync(listOfUsers);
        }

        private async Task ArrangeAndAssertValidSituationsAsync(List<UserDto> listOfUsers)
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var listOfUsersToImport = listOfUsers.ToArray();

            var service = Target(context, new Mock<IAuthorizationManager>().Object);

            int count = await service.ImportAsync(listOfUsersToImport);

            Assert.True(count > 0);
            Assert.Equal(listOfUsersToImport.Length, count);

            var importedUsers = await userRepo.GetAllAsync();
            Assert.Equal(count, importedUsers.Count);

            foreach (User importedUser in importedUsers)
            {
                Assert.Equal(importedUser.Email, importedUser.Email.Trim());
                Assert.Equal(importedUser.UserName, importedUser.UserName.Trim());
                Assert.Equal(importedUser.FirstName, importedUser.FirstName.Trim());
                Assert.Equal(importedUser.LastName, importedUser.LastName.Trim());
                Assert.Equal(Role.Employee, importedUser.Role);
            }
        }

        [Fact]
        public async Task ImportAsync_DatabaseContainsNotUniqueUsers_OkAsync()
        {
            var listOfUsers = new List<UserDto>
            {
                new UserDto("John", "Smith", "j.smith@example.com"),
            };

            var listOfUsersToImport = listOfUsers.ToArray();

            await using var context = InMemoryDatabaseHelper.GetDbContext();
            await new ApplicationUserFactory(
                    new FakeUser(Role.Employee, "j.smith@example.com", "John", "Smith"))
                .CreateConfirmedAsync(context);

            Assert.Equal(1, await context.Users.CountAsync());

            var service = Target(context, new Mock<IAuthorizationManager>().Object);

            Assert.Equal(0, await service.ImportAsync(listOfUsersToImport));

            Assert.Equal(1, await context.Users.CountAsync());
        }

        [Fact]
        public async Task ImportAsync_CollectionContainsNotUniqueUsers_ExceptionAsync()
        {
            var listOfUsers = new List<UserDto>
            {
                new UserDto("John", "Smith", "j.smith@example.com"),
                new UserDto("John1", "Smith1", "j.smith@example.com"),
            };

            var listOfUsersToImport = listOfUsers.ToArray();

            var userRepoMock = new Mock<IUserRepository>();
            userRepoMock
                .Setup(x => x.CheckHasUserWithUsernameAsync(It.IsAny<string>()))
                .Returns<string>(emailToCheck =>
                {
                    // To check that all emails were passed to this method
                    listOfUsers = listOfUsers.Where(x => x.UserName.Trim() != emailToCheck).ToList();
                    return Task.FromResult(false);
                });

            userRepoMock
                .Setup(x => x.InsertAsync(It.IsAny<IReadOnlyCollection<User>>()))
                .Returns<IReadOnlyCollection<User>>((usersToInsert)
                    => throw new InvalidOperationException("Should not be invoked"));

            var service = new UserService(
                userRepository: userRepoMock.Object,
                authorizationManager: new Mock<IAuthorizationManager>().Object,
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: new UserEmailStub(),
                userEvent: new UserEventStub());

            await Assert.ThrowsAsync<BadAssException>(() => service.ImportAsync(listOfUsersToImport));
        }

        [Fact]
        public async Task ImportAsync_NullCollection_ExceptionAsync()
        {
            var service = new UserService(
                userRepository: new Mock<IUserRepository>().Object,
                authorizationManager: new Mock<IAuthorizationManager>().Object,
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: new UserEmailStub(),
                userEvent: new UserEventStub());

            await Assert.ThrowsAsync<ArgumentNullException>(() => service.ImportAsync(null));
        }

        [Fact]
        public async Task ImportAsync_WrongDomain_ExceptionAsync()
        {
            var listOfUsers = new List<UserDto>
            {
                new UserDto("John", "Smith", "j.smith@example.comi")
            };

            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var listOfUsersToImport = listOfUsers.ToArray();

            var service = new UserService(
                userRepository: new UserRepository(context),
                authorizationManager: new Mock<IAuthorizationManager>().Object,
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: new UserEmailStub(),
                userEvent: new UserEventStub());

            await Assert.ThrowsAsync<BadAssException>(() => service.ImportAsync(listOfUsersToImport));
        }

        [Fact]
        public async Task ImportAsync_EmptyCollection_ExceptionAsync()
        {
            var service = new UserService(
                userRepository: new Mock<IUserRepository>().Object,
                authorizationManager: new Mock<IAuthorizationManager>().Object,
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: new UserEmailStub(),
                userEvent: new UserEventStub());

            await Assert.ThrowsAsync<InvalidOperationException>(() => service.ImportAsync(new List<UserDto>()));
        }

        [Fact]
        public async Task InsertAsync_Null_ExceptionAsync()
        {
            var service = new UserService(
                userRepository: new Mock<IUserRepository>().Object,
                authorizationManager: new Mock<IAuthorizationManager>().Object,
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: new UserEmailStub(),
                userEvent: new UserEventStub());

            await Assert.ThrowsAsync<ArgumentNullException>(() => service.InsertAsync(null));
        }

        [Fact]
        public async Task InsertAsync_WrongDomain_ExceptionAsync()
        {
            var user = new UserDto("John", "Smith", "j.smith@example.comi");

            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var service = Target(context, new Mock<IAuthorizationManager>().Object);

            await Assert.ThrowsAsync<BadAssException>(() => service.InsertAsync(user));
        }

        [Theory]
        [InlineData(Role.SystemAdministrator)]
        [InlineData(Role.TopManager)]
        [InlineData(Role.HRManager)]
        public async Task InsertAsync_NoFunctionalManager_OkAsync(Role currentUserRole)
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            IAuthorizationManager authMock = new FakeAuth(currentUserRole);

            var service = Target(context, authMock);

            User user = await service.GetByIdAsync(
                await service.InsertAsync(
                    new UserDto("John", "Test", "j.test@example.com")));

            Assert.Equal(Role.Employee, user.Role);
            Assert.Equal("John", user.FirstName);
            Assert.Equal("Test", user.LastName);
            Assert.Equal("j.test@example.com", user.UserName);
            Assert.Equal("j.test@example.com", user.Email);
        }

        [Fact]
        public async Task UpdateAsync_RoleTheSame_RoleDidntChanged_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userInDb = await new ApplicationUserFactory(
                    new FakeUser(
                        role: Role.Employee,
                        firstName: "Neo",
                        lastName: "Tom",
                        userName: "n.tom@example.com"))
                .BuildAsync(context);

            var newUserData = new UserDto(
                id: userInDb.Id,
                firstName: userInDb.FirstName + "1",
                lastName: userInDb.LastName + "1",
                userName: userInDb.Email + "1",
                role: Role.Employee);

            var target = new UserService(
                userRepository: new UserRepository(context),
                authorizationManager: FakeAuth.SysAdmin,
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: new UserEmailStub(),
                userEvent: new UserEventStub());

            await target.UpdateAsync(newUserData);

            userInDb = await target.GetByIdAsync(userInDb.Id);

            // was changed
            Assert.Equal("Neo1", userInDb.FirstName);
            Assert.Equal("Tom1", userInDb.LastName);

            // Was not changed
            Assert.Equal("n.tom@example.com", userInDb.Email);
            Assert.Equal("n.tom@example.com", userInDb.UserName);

            Assert.Equal(Role.Employee, userInDb.Role);
        }

        [Fact]
        public async Task UpdateAsync_SysAdminChangesRoleForOtherUser_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);
            var userInDb = await new ApplicationUserFactory(
                    new FakeUser(
                        role: Role.Employee,
                        firstName: "Neo",
                        lastName: "Tom",
                        userName: "n.tom@example.com"))
                .BuildAsync(userRepo);

            var newUserData = new UserDto(
                id: userInDb.Id,
                firstName: userInDb.FirstName + "1",
                lastName: userInDb.LastName + "1",
                userName: userInDb.Email + "1",
                role: Role.HRManager);

            var target = new UserService(
                userRepository: userRepo,
                authorizationManager: new FakeAuth(Role.SystemAdministrator),
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: new UserEmailStub(),
                userEvent: new UserEventStub());

            await target.UpdateAsync(newUserData);

            userInDb = await target.GetByIdAsync(userInDb.Id);

            // was changed
            Assert.Equal("Neo1", userInDb.FirstName);
            Assert.Equal("Tom1", userInDb.LastName);

            // Was not changed
            Assert.Equal("n.tom@example.com", userInDb.Email);
            Assert.Equal("n.tom@example.com", userInDb.UserName);

            Assert.Equal(Role.HRManager, userInDb.Role);
        }

        [Fact]
        public async Task UpdateAsync_EmployeeTriesToChangeRole_ExceptionAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);
            var userInDb = await new ApplicationUserFactory(
                    new FakeUser(
                        role: Role.Employee,
                        firstName: "Neo",
                        lastName: "Tom",
                        userName: "n.tom@example.com"))
                .BuildAsync(userRepo);

            var newUserData = new UserDto(
                id: userInDb.Id,
                firstName: userInDb.FirstName + "1",
                lastName: userInDb.LastName + "1",
                userName: userInDb.Email + "1",
                role: Role.HRManager);

            var target = new UserService(
                userRepository: userRepo,
                authorizationManager: new FakeAuth(Role.Employee),
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: new UserEmailStub(),
                userEvent: new UserEventStub());

            await Assert.ThrowsAsync<NoPermissionsException>(() => target.UpdateAsync(newUserData));
        }

        [Theory]
        [InlineData(Role.TopManager)]
        [InlineData(Role.HRManager)]
        public async Task UpdateAsync_NotAdminLowerRole_ExceptionAsync(Role currentUserRole)
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var user1 = await new ApplicationUserFactory(Role.Employee).BuildAsync(context);
            var user2 = await new ApplicationUserFactory(Role.Employee).BuildAsync(context);

            var service = Target(context, FakeAuth.SysAdmin);

            var createData = new UserDto("John", "Test", "j.test@example.com");
            long userId = await service.InsertAsync(createData);

            var updateData = AutomapperSingleton.Map<UserDto>(await service.GetByIdAsync(userId));

            updateData.Role = Role.SystemAdministrator;

            await service.UpdateAsync(updateData);

            service = Target(context, new FakeAuth(currentUserRole));

            updateData = AutomapperSingleton.Map<UserDto>(await service.GetByIdAsync(userId));
            updateData.Role = Role.Employee;

            await Assert.ThrowsAsync<NoPermissionsException>(() => service.UpdateAsync(updateData));
        }

        [Theory]
        [InlineData(Role.TopManager)]
        [InlineData(Role.HRManager)]
        public async Task UpdateAsync_NotAdminSetHigherRole_ExceptionAsync(Role currentUserRole)
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var user1 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
            var user2 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);

            IAuthorizationManager authMock = new FakeAuth(currentUserRole);

            var service = Target(context, authMock);

            var data = new UserDto("John", "Test", "j.test@example.com");

            long userId = await service.InsertAsync(data);

            data = AutomapperSingleton.Map<UserDto>(await service.GetByIdAsync(userId));
            data.Role = Role.SystemAdministrator;

            await Assert.ThrowsAsync<BadAssException>(() => service.UpdateAsync(data));
        }

        [Fact]
        public async Task UpdateAsync_AdminTriesToChangeHisRole_ExceptionAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            const string oldEmail = "old email";

            var userRepo = new UserRepository(context);

            var userInDb = await new ApplicationUserFactory(Role.SystemAdministrator).BuildAsync(userRepo);

            var newUserData = new UserDto(
                userInDb.Id,
                firstName: userInDb.FirstName + "1",
                lastName: userInDb.LastName + "1",
                userName: oldEmail + "1",
                role: Role.Employee);

            var target = new UserService(
                userRepository: userRepo,
                authorizationManager: new FakeAuth(userInDb),
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: new UserEmailStub(),
                userEvent: new UserEventStub());

            await Assert.ThrowsAsync<BadAssException>(() => target.UpdateAsync(newUserData));
        }

        [Theory]
        [InlineData(Role.Employee)]
        [InlineData(Role.HRManager)]
        [InlineData(Role.TopManager)]
        [InlineData(Role.SystemAdministrator)]
        [InlineData(Role.System)]
        public async Task GetByIdAsync_UserReturnsWithRole_OkAsync(Role userRole)
        {
            await using DatabaseContext context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var user = await new ApplicationUserFactory(userRole)
                .BuildAsync(userRepo);

            var target = Target(context, new FakeAuth(Role.HRManager));

            user = await target.GetByIdAsync(user.Id);

            Assert.NotNull(user);
            Assert.Equal(userRole, user.Role);
        }

        [Theory]
        [InlineData(Role.SystemAdministrator)]
        public async Task SendInviteEmailsAsync_EmailWasSentToNonConfirmedUser_OkAsync(Role currentUserRole)
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var user1 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
            var user2 = await new ApplicationUserFactory(Role.Employee).CreateConfirmedAsync(context);

            IAuthorizationManager authMock = new FakeAuth(currentUserRole);

            var emailStub = new UserEmailStub();

            var target = new UserService(
                userRepository: userRepo,
                authorizationManager: new FakeAuth(role: currentUserRole),
                emailDomainValidatorService: new EmailDomainValidatorService(domains: "example.com|hipo.kz"),
                emailSender: emailStub,
                userEvent: new UserEventStub());

            var emailsCount = await target.SendInviteEmailsAsync();
            Assert.Equal(1, emailsCount);
            Assert.Equal(1, emailStub.SendInviteEmailAsyncInvocations);
        }

        [Theory]
        [InlineData(Role.SystemAdministrator)]
        public async Task SendInviteEmailsAsync_EmailWasNotSentToConfirmedUser_OkAsync(Role currentUserRole)
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var user1 = await new ApplicationUserFactory(Role.Employee).CreateConfirmedAsync(context);
            var user2 = await new ApplicationUserFactory(Role.Employee).CreateConfirmedAsync(context);

            IAuthorizationManager authMock = new FakeAuth(currentUserRole);

            var emailStub = new UserEmailStub();

            var target = new UserService(
                userRepository: userRepo,
                authorizationManager: new FakeAuth(currentUserRole),
                emailDomainValidatorService: new EmailDomainValidatorService("example.com|hipo.kz"),
                emailSender: emailStub,
                userEvent: new UserEventStub());

            var emailsCount = await target.SendInviteEmailsAsync();
            Assert.Equal(0, emailsCount);
            Assert.Equal(0, emailStub.SendInviteEmailAsyncInvocations);
        }

        [Theory]
        [InlineData(Role.HRManager)]
        [InlineData(Role.Employee)]
        [InlineData(Role.TopManager)]
        public async Task SendInviteEmailsAsync_NotAllowedUsers_ExceptionAsync(Role currentUserRole)
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var user1 = await new ApplicationUserFactory(Role.Employee).BuildAsync(userRepo);
            var user2 = await new ApplicationUserFactory(Role.Employee).CreateConfirmedAsync(context);

            IAuthorizationManager authMock = new FakeAuth(currentUserRole);

            var service = Target(context, authMock);

            await Assert.ThrowsAsync<NoPermissionsException>(() => service.SendInviteEmailsAsync());
        }

        [Fact]
        public async Task RemoveNonConfirmedUsersFromDatabaseAsync_ConfirmedUsersWasNotRemoved_OkAsync()
        {
            await using var context = InMemoryDatabaseHelper.GetDbContext();
            var userRepo = new UserRepository(context);

            var anotherUser = await new ApplicationUserFactory(Role.Employee).CreateConfirmedAsync(context);
            var userToRemove = await new ApplicationUserFactory(Role.SystemAdministrator).CreateConfirmedAsync(context);

            var service = Target(context, new FakeAuth(Role.SystemAdministrator));
            await service.RemoveNonConfirmedUsersFromDatabaseAsync();

            var users = await userRepo.GetAllAsync();
            Assert.Equal(2, users.Count);
        }
    }
}