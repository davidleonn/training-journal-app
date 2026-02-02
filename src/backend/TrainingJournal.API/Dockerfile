# STAGE 1: Build
# Use the .NET 10 SDK to build the code
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore
COPY ["src/backend/TrainingJournal.API/TrainingJournal.API.csproj", "src/backend/TrainingJournal.API/"]
RUN dotnet restore "src/backend/TrainingJournal.API/TrainingJournal.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/backend/TrainingJournal.API"
RUN dotnet build "TrainingJournal.API.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "TrainingJournal.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# STAGE 2: Run
# Use the .NET 10 Runtime for the final container
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrainingJournal.API.dll"]