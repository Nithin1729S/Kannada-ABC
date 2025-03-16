## Environmental Variables

Create a `.env.local` file in the frontend directory with the following variables:

```env
MONGODB_URI=your_mongodb_uri            # MongoDB connection string 
GOOGLE_CLIENT_ID=your_google_client_id  # OAuth client ID from Google Cloud Console
GOOGLE_CLIENT_SECRET=your_google_client_secret  # OAuth client secret
NEXTAUTH_URL=http://localhost:3000      # Your application URL
NEXTAUTH_SECRET=random_string           # Random string for NextAuth session
NEXT_PUBLIC_BACKEND_URL=fastapi_address # URL of the FastAPI Backend Server
```

## Getting Started
To run the frontend application:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

To run the fastapi backend server:
```bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload
```

MongoDB - For User and his Progress related data \
FastAPI Server - to serve the cnn model
 
## Available Routes
| Route | Description |
|-------|-------------|
| `/learn` | Blank Canvas |
| `/practice` | Letter Tracing |
| `/profile` | View Learning Progress |
| `/auth` | Authentication |

# Kannada Handwritten Alphabet Recognition CNN Model 


## Training Process

### Data Loading and Preprocessing

- **Dataset:**  
  The dataset can be obtained from here [https://ieee-dataport.org/documents/kannada-language-image-dataset](https://ieee-dataport.org/documents/kannada-language-image-dataset).

- **Image Configuration:**  
  Images are converted to grayscale and resized to 28x28 pixels.  
  The dataset is split into training (80%) and validation (20%) sets using `tf.keras.utils.image_dataset_from_directory`, with labels one-hot encoded.

### Data Augmentation

To improve the generalization of the model, data augmentation is applied **only on the training set**:
- **Random Rotation**
- **Random Zoom**
- **Random Translation**

This augmentation is implemented using a Keras `Sequential` model.

### CNN Architecture

The CNN model consists of three convolutional blocks:

- **Block 1:**
  - Two convolutional layers (32 filters, 3×3 kernel, ReLU activation) with batch normalization.
  - Max pooling layer and dropout (25%).

- **Block 2:**
  - Two convolutional layers (64 filters, 3x3 kernel, ReLU activation) with batch normalization.
  - Max pooling and dropout (25%).

- **Block 3:**
  - Two convolutional layers (128 filters, 3x3 kernel, ReLU activation) with batch normalization.
  - Max pooling and dropout (25%).

Following the convolutional layers, the network is flattened and fed through dense layers:
- A dense layer with 128 neurons (ReLU activation) with batch normalization and dropout (50%).
- A final dense layer with a softmax activation that outputs probabilities for the 49 classes.

![mermaid-diagram-2025-03-14-021602](https://github.com/user-attachments/assets/8427b259-3d2b-47be-8270-04bcfd536b11)


### Compilation and Training

- **Compilation:**  
  The model is compiled with the Adam optimizer and categorical crossentropy loss.

- **Callbacks:**  
  - **EarlyStopping:** Monitors the validation loss and stops training if no improvement is seen for 5 epochs.
  - **ReduceLROnPlateau:** Reduces the learning rate when the validation loss plateaus.
  
- **Training:**  
  The model is set to train for up to 480 epochs; however, early stopping typically halts training sooner if the model converges.

- **Model Saving:**  
  Once training is complete, the model (both architecture and weights) is saved as `full_model.h5` for later use in inference.

## Inference and Evaluation

The trained model achieved 98.45% test accuracy.
