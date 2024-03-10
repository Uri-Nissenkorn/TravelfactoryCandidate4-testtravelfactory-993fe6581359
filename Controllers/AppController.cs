using Microsoft.AspNetCore.Mvc;
using TravelFactory.Services;
using OfficeOpenXml;

namespace TravelFactory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranslationsController : ControllerBase
    {
        private readonly ITranslationService _translationService;

        public TranslationsController(ITranslationService translationService)
        {
            _translationService = translationService;
        }

        [HttpGet("applications")]
        public ActionResult<IEnumerable<string>> GetApplications()
        {
            return Ok(_translationService.GetApplications());
        }

        [HttpPost("addApplication")]
        public ActionResult AddApplication([FromBody] string applicationName)
        {
            _translationService.AddApplication(applicationName);
            return Ok();
        }

        [HttpGet("downloadTranslations/{appName}")]
        public ActionResult DownloadTranslations(string appName)
        {
            var translations = _translationService.GetTranslationsForApp(appName);
            if (translations == null || translations.Count == 0)
            {
                return NotFound($"No translations found for application: {appName}.");
            }

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Translations");
                worksheet.Cells.LoadFromCollection(translations.Select(t => new { Key = t.Key, English = t.Value.English, French = t.Value.French, German = t.Value.German }), true);

                var stream = new MemoryStream();
                package.SaveAs(stream);
                stream.Position = 0;

                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"{appName}_translations.xlsx");
            }
        }

        [HttpPost("deploy/{appName}")]
        public ActionResult DeployTranslations(string appName)
        {
            _translationService.DeployTranslations(appName);
            return Ok("Translations deployed successfully.");
        }

        [HttpPost("addTranslationKey/{appName}")]
        public ActionResult AddTranslationKey(string appName, [FromBody] TranslationKeyData translationKeyData)
        {
            _translationService.AddTranslationKey(appName, translationKeyData.Key, translationKeyData.TranslationValue);
            return Ok("Translation key added successfully.");
        }

        // Action to get translations for a specific application
        [HttpGet("getTranslationsForApp/{appName}")]
        public ActionResult<Dictionary<string, TranslationValue>> GetTranslationsForApp(string appName)
        {
            var translations = _translationService.GetTranslationsForApp(appName);
            if (translations == null || translations.Count == 0)
            {
                return NotFound("Translations for the specified application not found.");
            }

            return Ok(translations);
        }
    }



    public class TranslationKeyData
    {
        public string? Key { get; set; }
        public TranslationValue? TranslationValue { get; set; }
    }
}
