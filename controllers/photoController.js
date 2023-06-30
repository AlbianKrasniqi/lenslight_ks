import Photo from "../models/photoModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const createPhoto = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "lenslight_ks",
    }
  );

  console.log("Result", result);

  try {
    await Photo.create({
      name: req.body.name,
      description: req.body.description,
      user: res.locals.user._id,
      url: result.secure_url,
    });

    // delete the photo
    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(201).redirect("/users/dashboard");
  } catch (err) {
    res.status(500).json({
      succeed: false,
      err,
    });
  }
};

const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({});
    res.status(201).render("photos", {
      photos,
      link: "photos",
    });
  } catch (err) {
    res.status(500).json({
      succeed: false,
      err,
    });
  }
};

const getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById({ _id: req.params.id }).populate("user");
    res.status(201).render("photo", {
      photo,
      link: "photos",
    });
  } catch (err) {
    res.status(500).json({
      succeed: false,
      err,
    });
  }
};

export { createPhoto, getAllPhotos, getPhoto };
