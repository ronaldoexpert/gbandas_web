
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

const formatarDataParaInput = (dateString) => {
     if (!dateString) return null;
  
    try {
        let dateObj;
        
        if (typeof dateString === 'string' && dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        
        if (!day || !month || !year) return null;
        
        dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        // Validação
        if (dateObj.getDate() !== parseInt(day) || 
            dateObj.getMonth() !== parseInt(month) - 1 || 
            dateObj.getFullYear() !== parseInt(year)) {
            return null;
        }
        } else {
            dateObj = new Date(dateString);
        }
        
        if (isNaN(dateObj.getTime())) return null;
        
        return dateObj.toISOString().slice(0, 10);
    } catch (error) {
        return null;
    }
};

export {OpenModal, CloseModal, formatarDataParaInput};