

const delImage = (imageId, images) =>{
    const imageArray = images.filter(image => {
        return image.cloudinary_id !== image_id
    });

}