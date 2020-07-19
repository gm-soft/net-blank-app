FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build

WORKDIR /src
COPY ["Company.Core.Api/Company.Core.Api.csproj", "Company.Core.Api/"]

RUN dotnet restore "Company.Core.Api/Company.Core.Api.csproj"
COPY . .
WORKDIR "/src/Company.Core.Api"
RUN dotnet build "Company.Core.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Company.Core.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Company.Core.Api.dll"]
