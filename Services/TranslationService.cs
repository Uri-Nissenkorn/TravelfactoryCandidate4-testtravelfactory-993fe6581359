using System.IO;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
namespace TravelFactory.Services
{
    public interface ITranslationService
    {
        IEnumerable<string> GetApplications();
        void AddApplication(string applicationName);
        Dictionary<string, TranslationValue> GetTranslationsForApp(string appName);
        bool AddTranslationKey(string appName, string key, TranslationValue translationValue);
        bool DeployTranslations(string appName);
    }

    public class TranslationValue
    {
        public string? English { get; set; }
        public string? French { get; set; }
        public string? German { get; set; }
    }


    public class TranslationService : ITranslationService
    {
        private readonly string _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "translator");

        public TranslationService()
        {
            if (!Directory.Exists(_storagePath))
            {
                Directory.CreateDirectory(_storagePath);
            }
        }

        public IEnumerable<string> GetApplications()
        {
            return Directory.GetFiles(_storagePath, "*.json")
                            .Select(Path.GetFileNameWithoutExtension)
                            .Where(name => !string.IsNullOrEmpty(name)); // Filter out any null or empty names
        }

        public void AddApplication(string applicationName)
        {
            string filePath = GetFilePath(applicationName);
            if (!File.Exists(filePath))
            {
                File.WriteAllText(filePath, JsonSerializer.Serialize(new Dictionary<string, TranslationValue>()));
            }
        }

        public Dictionary<string, TranslationValue> GetTranslationsForApp(string appName)
        {
            string filePath = GetFilePath(appName);
            if (File.Exists(filePath))
            {
                string json = File.ReadAllText(filePath);
                return JsonSerializer.Deserialize<Dictionary<string, TranslationValue>>(json) ?? new Dictionary<string, TranslationValue>();
            }

            return new Dictionary<string, TranslationValue>();
        }

        public bool AddTranslationKey(string appName, string key, TranslationValue translationValue)
        {
            var translations = GetTranslationsForApp(appName);
            translations[key] = translationValue;
            SaveTranslations(appName, translations);
            return true;
        }

        public bool DeployTranslations(string appName)
        {
            SaveTranslations(appName, GetTranslationsForApp(appName));
            return true;
        }

        private string GetFilePath(string appName) => Path.Combine(_storagePath, $"{appName}.json");

        private void SaveTranslations(string appName, Dictionary<string, TranslationValue> translations)
        {
            string filePath = GetFilePath(appName);

            File.WriteAllText(filePath, JsonSerializer.Serialize(translations, new JsonSerializerOptions { WriteIndented = true }));
        }
    }
}