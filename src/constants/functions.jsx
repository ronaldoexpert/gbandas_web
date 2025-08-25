
function CloseModal(idModal){
        const modalElement = document.getElementById(idModal);
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
        modalInstance.hide();
}

function OpenModal(idModal){
    const modalElement = document.getElementById(idModal);
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
    modalInstance.show();
}

export {OpenModal, CloseModal};