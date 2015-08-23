using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using SwapEntities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MvcWebRole.Controllers
{
    public class PhotoController : ApiController
    {
        static readonly string hostName = "//hokieswapstorage.blob.core.windows.net/";
        static readonly string hostContainer = "photos";
        static readonly string fileExtension = ".jpg";
        static readonly string contentType = "image/jpeg";
        static readonly int photoWidth = 450;
        static CloudBlobContainer blobContainer;

        public PhotoController()
            : base()
        {
            var storageAccount = CloudStorageAccount.Parse(
                RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

            // Create the blob client.
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Retrieve reference to a previously created container.
            blobContainer = blobClient.GetContainerReference(hostContainer);
        }

        public HttpResponseMessage Post()
        {
            Photo newPhoto = new Photo();

            // Loop through each uploaded file
            foreach (string fileKey in HttpContext.Current.Request.Files.Keys)
            {
                HttpPostedFile file = HttpContext.Current.Request.Files[fileKey];
                // Skip unused file controls.
                if (file.ContentLength <= 0) continue;

                string guid = Guid.NewGuid().ToString();
                string fileName = guid + fileExtension;
                string src = hostName + hostContainer + "/" + fileName;

                // Add filename to srcList
                newPhoto = new Photo
                {
                    Id = guid,
                    DateTimeCreated = new DateTimeOffset(DateTime.UtcNow),
                    Source = src,
                    Width = photoWidth
                };

                // Retrieve reference to the blob we want to create            
                CloudBlockBlob blockBlob = blobContainer.GetBlockBlobReference(fileName);

                // Populate our blob with contents from the uploaded file.
                using (var ms = new MemoryStream())
                {
                    ImageResizer.ImageJob i = new ImageResizer.ImageJob(file.InputStream,
                            ms, new ImageResizer.ResizeSettings("width=" + photoWidth
                                + ";format=" + fileExtension));
                    i.Build();

                    blockBlob.Properties.ContentType = contentType;
                    ms.Seek(0, SeekOrigin.Begin);
                    blockBlob.UploadFromStream(ms);
                }
            }

            return Request.CreateResponse(HttpStatusCode.Created, newPhoto);
        }

        public HttpResponseMessage Delete(string id)
        {
            try
            {
                // Retrieve reference to a blob named "myblob.txt".
                CloudBlockBlob blockBlob = blobContainer.GetBlockBlobReference(id + fileExtension);

                // Delete the blob.
                blockBlob.Delete();
                return Request.CreateResponse(HttpStatusCode.NoContent, "application/json");
            }
            catch (Exception e)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }
    }
}
