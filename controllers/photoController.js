import Photo from "../models/photoModel.js";

const createPhoto = async (req, res) => {
  try {
    await Photo.create({
      name: req.body.name,
      description: req.body.description,
      user: res.locals.user._id,
    });
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
    const photo = await Photo.findById({ _id: req.params.id });
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
