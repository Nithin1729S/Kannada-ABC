# ಅಕ್ಷರ ಕಲಿ - Kannada Alphabet Learning Application

**ಅಕ್ಷರ ಕಲಿ** (*Akshara Kali*) is an interactive Kannada alphabet learning application designed to help kids learn and practice Kannada script through guided tracing and personalized progress tracking. The platform integrates a **CNN-based handwriting recognition model** to evaluate handwriting accuracy and improve learning outcomes. It is built using **Next.js** for the frontend with **NextAuth.js** for authentication and **Tailwind CSS** for styling. The backend is powered by **FastAPI**, with **MongoDB** managing user progress and authentication data. The handwriting recognition model is developed using **TensorFlow/Keras**, with **OpenCV** for image preprocessing.

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

### Running the Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Running the FastAPI Backend
```bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload
```

### Dependencies
- **MongoDB**: Stores user data and learning progress.
- **FastAPI Server**: Serves the CNN model for Kannada handwritten character recognition.

## Available Routes

| Route       | Description            |
|------------|------------------------|
| `/learn`   | Blank Canvas           |
| `/practice`| Letter Tracing         |
| `/profile` | View Learning Progress |
| `/auth`    | Authentication         |

---

## Kannada Handwritten Alphabet Recognition CNN Model

### Training Process

### Data Loading and Preprocessing

- **Dataset:**  
  The dataset can be obtained from [IEEE Dataport](https://ieee-dataport.org/documents/kannada-language-image-dataset).

- **Image Configuration:**  
  - Images are converted to grayscale and resized to 28x28 pixels.
  - The dataset is split into training (80%) and validation (20%) sets.
  - Labels are one-hot encoded using `tf.keras.utils.image_dataset_from_directory`.

### Data Augmentation

To improve generalization, data augmentation is applied **only to the training set**:
- Random Rotation
- Random Zoom
- Random Translation

Implemented using Keras `Sequential` model.

### CNN Architecture

The model consists of three convolutional blocks:

#### **Block 1:**
- Two convolutional layers (32 filters, 3×3 kernel, ReLU activation) with batch normalization.
- Max pooling layer and dropout (25%).

#### **Block 2:**
- Two convolutional layers (64 filters, 3x3 kernel, ReLU activation) with batch normalization.
- Max pooling and dropout (25%).

#### **Block 3:**
- Two convolutional layers (128 filters, 3x3 kernel, ReLU activation) with batch normalization.
- Max pooling and dropout (25%).

#### **Final Layers:**
- Flattened output is passed through:
  - Dense layer with 128 neurons (ReLU activation), batch normalization, and dropout (50%).
  - Final dense layer with a softmax activation to classify into 49 Kannada characters.

![CNN Architecture](https://github.com/user-attachments/assets/8427b259-3d2b-47be-8270-04bcfd536b11)

### Compilation and Training

- **Compilation:**
  - Adam optimizer
  - Categorical crossentropy loss

- **Callbacks:**
  - **EarlyStopping:** Stops training if validation loss doesn't improve for 5 epochs.
  - **ReduceLROnPlateau:** Reduces learning rate when validation loss plateaus.

- **Training:**
  - The model is trained for up to 480 epochs with early stopping enabled.

- **Model Saving:**
  - The trained model is saved as `full_model.h5` for later inference.

### Inference and Evaluation
**Test Accuracy:** 98.45%
