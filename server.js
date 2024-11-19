import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json());

async function isImageURL(url) {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");
    return contentType && contentType.startsWith("image/");
  } catch (error) {
    return false;
  }
}

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
/**
 * Filters an image from a provided URL.
 *
 * This endpoint takes an image URL as a query parameter and returns the path to the filtered image.
 *
 * @param {string} req.query.image_url - The URL of the image to filter
 * @returns {string} The path to the filtered image
 * @throws {Error} If an error occurs during image processing
 */
app.get("/filteredimage", async (req, res) => {
  try {
    const imageUrl = req.query.image_url;

    if (!imageUrl) {
      return res.status(400).send("Image URL is missing");
    } else if (!isImageURL(imageUrl)) {
      return res.status(404).send("Image URL is invalid");
    } else {
      const filteredImage = await filterImageFromURL(imageUrl);

      res.sendFile(filteredImage, () => {
        deleteLocalFiles([filteredImage]);
      });
    }
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Error processing image.");
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log("press CTRL+C to stop server");
});
