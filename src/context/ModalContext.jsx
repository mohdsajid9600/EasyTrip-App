import { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '../components/modals/ConfirmModal';
import SuccessModal from '../components/modals/SuccessModal';
import ErrorModal from '../components/modals/ErrorModal';
import WarningModal from '../components/modals/WarningModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        type: null,
        props: {}
    });

    const hideModal = useCallback(() => {
        setModalState({ type: null, props: {} });
    }, []);

    const showConfirm = useCallback((props) => {
        setModalState({ type: 'CONFIRM', props });
    }, []);

    const showSuccess = useCallback((props) => {
        setModalState({ type: 'SUCCESS', props });
    }, []);

    const showError = useCallback((props) => {
        setModalState({ type: 'ERROR', props });
    }, []);

    const showWarning = useCallback((props) => {
        setModalState({ type: 'WARNING', props });
    }, []);

    const renderModal = () => {
        const { type, props } = modalState;

        switch (type) {
            case 'CONFIRM':
                return <ConfirmModal isOpen={true} onClose={hideModal} {...props} />;
            case 'SUCCESS':
                return <SuccessModal isOpen={true} onClose={() => { hideModal(); if (props.onConfirm) props.onConfirm(); }} {...props} />;
            case 'ERROR':
                return <ErrorModal isOpen={true} onClose={hideModal} {...props} />;
            case 'WARNING':
                return <WarningModal isOpen={true} onClose={hideModal} {...props} />;
            default:
                return null;
        }
    };

    return (
        <ModalContext.Provider value={{ showConfirm, showSuccess, showError, showWarning, hideModal }}>
            {children}
            {renderModal()}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
