/**
 * Component Event Handlers
 * 
 * This file contains event handler functions for the various components in the kitchensink.
 * These functions are called by the components-sections.js component after loading component content.
 */

// Function to initialize dialog event listeners
function initializeDialogListeners() {
    console.log('Initializing dialog event listeners');
    
    // Check if elements exist
    const basicDialogBtn = document.getElementById('open-basic-dialog');
    console.log('Found open-basic-dialog button:', !!basicDialogBtn);
    
    const basicDialog = document.getElementById('basic-dialog');
    console.log('Found basic-dialog element:', !!basicDialog);
    
    // Basic dialogs
    document.getElementById('open-basic-dialog')?.addEventListener('click', () => {
        console.log('Open basic dialog button clicked');
        document.getElementById('basic-dialog').show();
    });
    document.getElementById('close-basic-dialog')?.addEventListener('click', () => {
        document.getElementById('basic-dialog').close();
    });
    
    document.getElementById('open-success-dialog')?.addEventListener('click', () => {
        document.getElementById('success-dialog').show();
    });
    document.getElementById('close-success-dialog')?.addEventListener('click', () => {
        document.getElementById('success-dialog').close();
    });
    
    document.getElementById('open-danger-dialog')?.addEventListener('click', () => {
        document.getElementById('danger-dialog').show();
    });
    document.getElementById('close-danger-dialog')?.addEventListener('click', () => {
        document.getElementById('danger-dialog').close();
    });
    
    document.getElementById('open-info-dialog')?.addEventListener('click', () => {
        document.getElementById('info-dialog').show();
    });
    document.getElementById('close-info-dialog')?.addEventListener('click', () => {
        document.getElementById('info-dialog').close();
    });
    
    // Size dialogs
    document.getElementById('open-small-dialog')?.addEventListener('click', () => {
        document.getElementById('small-dialog').show();
    });
    document.getElementById('close-small-dialog')?.addEventListener('click', () => {
        document.getElementById('small-dialog').close();
    });
    
    document.getElementById('open-medium-dialog')?.addEventListener('click', () => {
        document.getElementById('medium-dialog').show();
    });
    document.getElementById('close-medium-dialog')?.addEventListener('click', () => {
        document.getElementById('medium-dialog').close();
    });
    
    document.getElementById('open-large-dialog')?.addEventListener('click', () => {
        document.getElementById('large-dialog').show();
    });
    document.getElementById('close-large-dialog')?.addEventListener('click', () => {
        document.getElementById('large-dialog').close();
    });
    
    // Modal dialogs
    document.getElementById('open-modal-dialog')?.addEventListener('click', () => {
        document.getElementById('modal-dialog').show();
    });
    document.getElementById('close-modal-dialog')?.addEventListener('click', () => {
        document.getElementById('modal-dialog').close();
    });
    
    document.getElementById('open-non-modal-dialog')?.addEventListener('click', () => {
        document.getElementById('non-modal-dialog').show();
    });
    document.getElementById('close-non-modal-dialog')?.addEventListener('click', () => {
        document.getElementById('non-modal-dialog').close();
    });
    
    // Custom header dialog
    document.getElementById('open-custom-header-dialog')?.addEventListener('click', () => {
        document.getElementById('custom-header-dialog').show();
    });
    document.getElementById('close-custom-header-dialog')?.addEventListener('click', () => {
        document.getElementById('custom-header-dialog').close();
    });
}

// Function to initialize input event listeners
function initializeInputListeners() {
    console.log('Initializing input event listeners');
    
    const inputs = document.querySelectorAll('dotbox-input');
    console.log('Found input elements:', inputs.length);
    
    inputs.forEach(input => {
        // Add event listeners
        input.addEventListener('input', (e) => {
            console.log('Input event:', e.detail);
        });
        
        input.addEventListener('change', (e) => {
            console.log('Change event:', e.detail);
        });
        
        input.addEventListener('focus', (e) => {
            console.log('Focus event on:', e.target.label || 'unlabeled input');
        });
        
        input.addEventListener('blur', (e) => {
            console.log('Blur event on:', e.target.label || 'unlabeled input');
        });
    });
    
    // Manual validation example buttons
    document.getElementById('set-valid-btn')?.addEventListener('click', () => {
        const input = document.getElementById('manual-validation-input');
        if (input) {
            input.setValid();
            console.log('Set input as valid');
        }
    });

    document.getElementById('set-invalid-btn')?.addEventListener('click', () => {
        const input = document.getElementById('manual-validation-input');
        if (input) {
            input.setInvalid('This field has been manually marked as invalid');
            console.log('Set input as invalid');
        }
    });
    
    // Form validation example
    document.getElementById('form-submit')?.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get all inputs
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const passwordInput = document.getElementById('form-password');
        const resultDiv = document.getElementById('form-result');
        
        if (!nameInput || !emailInput || !passwordInput || !resultDiv) {
            console.log('Form elements not found');
            return;
        }
        
        // Validate all inputs
        const nameValid = nameInput.validate();
        const emailValid = emailInput.validate();
        const passwordValid = passwordInput.validate();
        
        // Check if all inputs are valid
        if (nameValid && emailValid && passwordValid) {
            // Form is valid
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <i class="fa fa-check-circle"></i> Form is valid!
                </div>
            `;
            console.log('Form is valid!');
        } else {
            // Form is invalid
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fa fa-exclamation-circle"></i> Please fix the errors in the form.
                </div>
            `;
            console.log('Form is invalid!');
        }
    });
}

// Function to initialize notification event listeners
function initializeNotificationListeners() {
    console.log('Initializing notification event listeners');
    
    // Basic usage
    document.getElementById('show-default-notification')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Default Notification',
            message: 'This is a default notification',
            variant: 'default'
        }).then(() => {
            console.log('Default notification shown');
        }).catch(error => {
            console.error('Error showing default notification:', error);
        });
    });
    
    document.getElementById('show-success-notification')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Success!',
            message: 'Operation completed successfully',
            variant: 'success'
        }).then(() => {
            console.log('Success notification shown');
        }).catch(error => {
            console.error('Error showing success notification:', error);
        });
    });
    
    document.getElementById('show-warning-notification')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Warning',
            message: 'Please check your input',
            variant: 'warning'
        }).then(() => {
            console.log('Warning notification shown');
        }).catch(error => {
            console.error('Error showing warning notification:', error);
        });
    });
    
    document.getElementById('show-danger-notification')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Error',
            message: 'Something went wrong',
            variant: 'danger'
        }).then(() => {
            console.log('Danger notification shown');
        }).catch(error => {
            console.error('Error showing danger notification:', error);
        });
    });
    
    document.getElementById('show-info-notification')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Information',
            message: 'Here is some information',
            variant: 'info'
        }).then(() => {
            console.log('Info notification shown');
        }).catch(error => {
            console.error('Error showing info notification:', error);
        });
    });
    
    // Positions
    document.getElementById('show-top-right')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Top Right',
            message: 'This notification appears at the top-right',
            position: 'top-right',
            variant: 'info'
        }).then(() => {
            console.log('Top right notification shown');
        }).catch(error => {
            console.error('Error showing top right notification:', error);
        });
    });
    
    document.getElementById('show-top-left')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Top Left',
            message: 'This notification appears at the top-left',
            position: 'top-left',
            variant: 'info'
        }).then(() => {
            console.log('Top left notification shown');
        }).catch(error => {
            console.error('Error showing top left notification:', error);
        });
    });
    
    document.getElementById('show-bottom-right')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Bottom Right',
            message: 'This notification appears at the bottom-right',
            position: 'bottom-right',
            variant: 'info'
        }).then(() => {
            console.log('Bottom right notification shown');
        }).catch(error => {
            console.error('Error showing bottom right notification:', error);
        });
    });
    
    document.getElementById('show-bottom-left')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Bottom Left',
            message: 'This notification appears at the bottom-left',
            position: 'bottom-left',
            variant: 'info'
        }).then(() => {
            console.log('Bottom left notification shown');
        }).catch(error => {
            console.error('Error showing bottom left notification:', error);
        });
    });
    
    document.getElementById('show-top-center')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Top Center',
            message: 'This notification appears at the top-center',
            position: 'top-center',
            variant: 'info'
        }).then(() => {
            console.log('Top center notification shown');
        }).catch(error => {
            console.error('Error showing top center notification:', error);
        });
    });
    
    document.getElementById('show-bottom-center')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Bottom Center',
            message: 'This notification appears at the bottom-center',
            position: 'bottom-center',
            variant: 'info'
        }).then(() => {
            console.log('Bottom center notification shown');
        }).catch(error => {
            console.error('Error showing bottom center notification:', error);
        });
    });
    
    // Stacking behavior
    document.getElementById('show-stacking')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'First Notification',
            message: 'This is the first notification',
            variant: 'info',
            stacking: true
        }).then(() => {
            console.log('First notification shown');
        }).catch(error => {
            console.error('Error showing first notification:', error);
        });
        
        setTimeout(() => {
            DotboxNotification.show({
                title: 'Second Notification',
                message: 'This is the second notification',
                variant: 'success',
                stacking: true
            }).then(() => {
                console.log('Second notification shown');
            }).catch(error => {
                console.error('Error showing second notification:', error);
            });
        }, 500);
        
        setTimeout(() => {
            DotboxNotification.show({
                title: 'Third Notification',
                message: 'This is the third notification',
                variant: 'warning',
                stacking: true
            }).then(() => {
                console.log('Third notification shown');
            }).catch(error => {
                console.error('Error showing third notification:', error);
            });
        }, 1000);
    });
    
    document.getElementById('show-non-stacking')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'First Notification',
            message: 'This will be replaced',
            variant: 'info',
            stacking: false
        }).then(() => {
            console.log('First notification shown');
        }).catch(error => {
            console.error('Error showing first notification:', error);
        });
        
        setTimeout(() => {
            DotboxNotification.show({
                title: 'Second Notification',
                message: 'This replaces the first one',
                variant: 'success',
                stacking: false
            }).then(() => {
                console.log('Second notification shown');
            }).catch(error => {
                console.error('Error showing second notification:', error);
            });
        }, 1000);
        
        setTimeout(() => {
            DotboxNotification.show({
                title: 'Third Notification',
                message: 'This replaces the second one',
                variant: 'warning',
                stacking: false
            }).then(() => {
                console.log('Third notification shown');
            }).catch(error => {
                console.error('Error showing third notification:', error);
            });
        }, 2000);
    });
    
    // Duration
    document.getElementById('show-auto-close')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Auto-close',
            message: 'This notification will close after 5 seconds',
            duration: 5000, // 5 seconds
            variant: 'info'
        }).then(() => {
            console.log('Auto-close notification shown');
        }).catch(error => {
            console.error('Error showing auto-close notification:', error);
        });
    });
    
    document.getElementById('show-no-auto-close')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'No Auto-close',
            message: 'This notification will stay until manually closed',
            duration: 0, // No auto-close
            variant: 'info'
        }).then(() => {
            console.log('No auto-close notification shown');
        }).catch(error => {
            console.error('Error showing no auto-close notification:', error);
        });
    });
    
    // Icons
    document.getElementById('show-custom-icon')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'Custom Icon',
            message: 'This notification has a custom icon',
            icon: 'fa-star',
            variant: 'info'
        }).then(() => {
            console.log('Custom icon notification shown');
        }).catch(error => {
            console.error('Error showing custom icon notification:', error);
        });
    });
    
    document.getElementById('show-no-icon')?.addEventListener('click', () => {
        DotboxNotification.show({
            title: 'No Icon',
            message: 'This notification has no icon',
            icon: '', // Empty string to override default icon
            variant: 'info'
        }).then(() => {
            console.log('No icon notification shown');
        }).catch(error => {
            console.error('Error showing no icon notification:', error);
        });
    });
}

// Function to initialize checkbox event listeners
function initializeCheckboxListeners() {
    console.log('Initializing checkbox event listeners');
    
    // Event demo checkbox
    const eventDemoCheckbox = document.getElementById('event-demo-checkbox');
    const eventDemoOutput = document.getElementById('event-demo-output');
    
    if (eventDemoCheckbox && eventDemoOutput) {
        eventDemoCheckbox.addEventListener('change', (e) => {
            eventDemoOutput.textContent = `Change event: checked = ${e.detail.checked}, value = ${e.detail.value}`;
        });
    }
}

// Export the functions
export {
    initializeDialogListeners,
    initializeInputListeners,
    initializeNotificationListeners,
    initializeCheckboxListeners
}; 