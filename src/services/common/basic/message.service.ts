import { Injectable } from '@angular/core';

const messages = {
  // English Messages
  en: {
    // Alert Messages
    ALERT_ACTION_SUCCESS: { title: 'Success!', message: 'Action completed successfully.' },
    ALERT_ACTION_ERROR: { title: 'Error!', message: 'There was an error when trying to perform the action.' },
    ALERT_SEARCH_SUCCESS: { title: 'Success!', message: 'Search completed successfully.' },
    ALERT_SEARCH_ERROR: { title: 'Error!', message: 'There was an error when trying to perform the search.' },
    ALERT_SAVE_SUCCESS: { title: 'Success!', message: 'Record saved successfully.' },
    ALERT_SAVE_ERROR: { title: 'Error!', message: 'Error occurred while saving the record.' },
    ALERT_DELETE_SUCCESS: { title: 'Success!', message: 'Record deleted successfully.' },
    ALERT_DELETE_ERROR: { title: 'Error!', message: 'Error occurred while deleting the record.' },
    // Other Messages
    EMAIL_SENT_SUCCESS: { title: 'Success!', message: 'Email sent successfully.' },
    EMAIL_SENT_ERROR: { title: 'Error!', message: 'Error occurred while sending the email.' },
    FORM_SENT_SUCCESS: { title: 'Success!', message: 'Form sent successfully.' },
    FORM_SENT_ERROR: { title: 'Error!', message: 'Error occurred while sending the form.' },
    FILE_UPLOAD_SUCCESS: { title: 'Success!', message: 'The image was charged successfully.' },
    FILE_UPLOAD_ERROR: { title: 'Error!', message: 'There was an error when trying to load the image.' },
    FILE_UPLOAD_LIMIT_EXCEEDED_ERROR: { title: 'Error!', message: 'File upload limit exceeded.' },
    INSTRUCTIONS_SENT_SUCCESS: { title: 'Success!', message: 'Instructions sent successfully.' },
    INSTRUCTIONS_SENT_ERROR: { title: 'Error!', message: 'Error occurred while sending the instructions.' },
    PASSWORD_CHANGE_SUCCESS: { title: 'Success!', message: 'The password has changed.' },
    PASSWORD_CHANGE_ERROR: { title: 'Error!', message: 'There was an error when trying to change the password.' },
    TEMPLATE_COPY_SUCCESS: { title: 'Copy made', message: 'The template has been copied successfully..' },
    ALERT_SEND_TEST_SUCCESS: { title: 'Success', message: 'Email sent successfully' },
  },
  // Spanish Messages
  es: {
    // Alert Messages
    ALERT_ACTION_SUCCESS: { title: '¡Éxito!', message: 'Acción completada correctamente.' },
    ALERT_ACTION_ERROR: { title: '¡Error!', message: 'Se produjo un error al intentar realizar la acción.' },
    ALERT_SEARCH_SUCCESS: { title: '¡Éxito!', message: 'Búsqueda completada correctamente.' },
    ALERT_SEARCH_ERROR: { title: '¡Error!', message: 'Se produjo un error al intentar realizar la búsqueda.' },
    ALERT_SAVE_SUCCESS: { title: '¡Éxito!', message: 'Registro guardado correctamente.' },
    ALERT_SAVE_ERROR: { title: '¡Error!', message: 'Se produjo un error al guardar el registro.' },
    ALERT_DELETE_SUCCESS: { title: '¡Éxito!', message: 'Registro eliminado correctamente.' },
    ALERT_DELETE_ERROR: { title: '¡Error!', message: 'Se produjo un error al eliminar el registro.' },
    // Other Messages
    EMAIL_SENT_SUCCESS: { title: '¡Éxito!', message: 'Correo electrónico enviado correctamente.' },
    EMAIL_SENT_ERROR: { title: '¡Error!', message: 'Se produjo un error al enviar el correo electrónico.' },
    FORM_SENT_SUCCESS: { title: '¡Éxito!', message: 'Formulario enviado correctamente.' },
    FORM_SENT_ERROR: { title: '¡Error!', message: 'Se produjo un error al enviar el formulario.' },
    FILE_UPLOAD_SUCCESS: { title: '¡Éxito!', message: 'Se cargó la imagen con éxito.' },
    FILE_UPLOAD_ERROR: { title: '¡Error!', message: 'Se produjo un error al intentar cargar la imagen.' },
    FILE_UPLOAD_LIMIT_EXCEEDED_ERROR: { title: '¡Error!', message: 'Límite de carga de archivo excedido.' },
    INSTRUCTIONS_SENT_SUCCESS: { title: '¡Éxito!', message: 'Instrucciones enviadas correctamente.' },
    INSTRUCTIONS_SENT_ERROR: { title: '¡Error!', message: 'Se produjo un error al enviar las instrucciones.' },
    PASSWORD_CHANGE_SUCCESS: { title: '¡Éxito!', message: 'Se ha cambiado la contraseña.' },
    PASSWORD_CHANGE_ERROR: { title: '¡Error!', message: 'Se produjo un error al intentar cambiar la contraseña.' },
    TEMPLATE_COPY_SUCCESS: { title: 'Copia realizada', message: 'Se ha realizo la copia de la plantilla correctamente.' },
    ALERT_SEND_TEST_SUCCESS: { title: '¡Éxito!', message: 'Correo de prueba enviado correctamente.' },
  }
};

type MessageKey = typeof messages.en;

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private currentLanguage: 'en' | 'es' = 'en';

  /**
   * Sets the current language.
   * @param language The language to set.
   */
  setLanguage(language: 'en' | 'es') {
    this.currentLanguage = language;
  }

  /**
   * Gets a message by key and language.
   * @param key The key of the message to retrieve.
   * @returns The message object.
   */
  getMessage<K extends keyof MessageKey>(key: K): MessageAlert {
    return messages[this.currentLanguage][key];
  }
}


export interface MessageAlert {
  title: string;
  message: string;
}
