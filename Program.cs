using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace TestML
{
    class Program
    {

        public class StringTable
        {
            public string[] ColumnNames { get; set; }
            public string[,] Values { get; set; }
        }
       
     
            static void Main(string[] args)
            {
                InvokeRequestResponseService().Wait();
                Console.ReadLine();
            }

            static async Task InvokeRequestResponseService()
            {
                using (var client = new HttpClient())
                {
                    var scoreRequest = new
                    {

                        Inputs = new Dictionary<string, StringTable>() {
                        {
                            "input1",
                            new StringTable()
                            {
                                ColumnNames = new string[] {"Survived", "Pclass", "Sex", "Age", "Embarked"},
                                Values = new string[,] {  { "1", "2", "Female", "46", "C" }}, //,  { "0", "0", "value", "0", "value" },  }
                            }
                        },
                    },
                        GlobalParameters = new Dictionary<string, string>()
                        {
                        }
                    };
                    const string apiKey = "gl3UXbfkxWwMfbe12RggeYO/lZeVaP11FZDlC75Ufmxvzj+vXxnvFOizAympoWlEgRR9FQXQqT27ksE/WzpPNQ=="; // Replace this with the API key for the web service
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                    client.BaseAddress = new Uri("https://ussouthcentral.services.azureml.net/workspaces/abefe921187546dbbdc849a1b5a36f0a/services/1d9d84b04f2f4f5ea380e8ab8698fa5e/execute?api-version=2.0&details=true");

                    // WARNING: The 'await' statement below can result in a deadlock if you are calling this code from the UI thread of an ASP.Net application.
                    // One way to address this would be to call ConfigureAwait(false) so that the execution does not attempt to resume on the original context.
                    // For instance, replace code such as:
                    //      result = await DoSomeTask()
                    // with the following:
                    //      result = await DoSomeTask().ConfigureAwait(false)


                    HttpResponseMessage response = await client.PostAsJsonAsync("", scoreRequest);

                    if (response.IsSuccessStatusCode)
                    {
                        string result = await response.Content.ReadAsStringAsync();
                        Console.WriteLine("Result: {0}", result);
                    }
                    else
                    {
                        Console.WriteLine(string.Format("The request failed with status code: {0}", response.StatusCode));

                        // Print the headers - they include the requert ID and the timestamp, which are useful for debugging the failure
                        Console.WriteLine(response.Headers.ToString());

                        string responseContent = await response.Content.ReadAsStringAsync();
                        Console.WriteLine(responseContent);
                    }
                }
            }
        }
    
}
