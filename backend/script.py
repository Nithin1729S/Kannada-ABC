import tensorflow as tf
import numpy as np

# Load the saved full model
model_save_path = "full_model.h5"
loaded_model = tf.keras.models.load_model(model_save_path)
print("Loaded model from", model_save_path)

# Define class names (ensure they match the ones used during training)
class_names =  ['1', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '2', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '3', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '4', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '5', '6', '7', '8', '9'] # Update with actual class names

# Function to classify a single image
def predict_label(image_path, model, class_names, img_height=28, img_width=28):
    img = tf.keras.preprocessing.image.load_img(
        image_path,
        target_size=(img_height, img_width),
        color_mode="grayscale"
    )
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    prediction = model.predict(img_array)
    return class_names[np.argmax(prediction)]

# Predict an image
image_path = "8.jpg"
predicted_label = predict_label(image_path, loaded_model, class_names)
print("Predicted label:", predicted_label)