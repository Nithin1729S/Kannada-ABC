import React from 'react';

class ModalManager {
  private static instance: ModalManager;
  private modalRoot: HTMLDivElement | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  private constructor() {
    // Create modal root element
    this.modalRoot = document.createElement('div');
    this.modalRoot.id = 'modal-root';
    document.body.appendChild(this.modalRoot);
  }

  public static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }

  public show(message: string = 'Try again') {
    if (!this.modalRoot) return;

    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Add playful styles if they don't exist
    if (!document.getElementById('modal-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'modal-styles';
      styleSheet.textContent = `
        @keyframes modalPopIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          background: transparent; /* No dark overlay */
        }
        .modal-content {
          background: linear-gradient(135deg, #ffecd2, #fcb69f);
          border: 3px solid #ff8a80;
          border-radius: 15px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          max-width: 20rem;
          width: 90%;
          animation: modalPopIn 0.5s ease-out;
          text-align: center;
          font-family: 'Comic Sans MS', cursive, sans-serif;
          color: #333;
        }
        .modal-text {
          font-size: 1.3rem;
          font-weight: bold;
          margin: 0;
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Create and render modal with a playful message
    const modalHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <p class="modal-text">${message}</p>
        </div>
      </div>
    `;

    this.modalRoot.innerHTML = modalHTML;

    // Auto-hide after 2 seconds
    this.timeoutId = setTimeout(() => {
      if (this.modalRoot) {
        this.modalRoot.innerHTML = '';
      }
    }, 2000);
  }
}

// Export a simple function to show the modal
export const showModal = (message?: string) => {
  ModalManager.getInstance().show(message);
};
