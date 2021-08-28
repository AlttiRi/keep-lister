import {ref} from "vue";

export const debugMessage = ref("");
export function addMessage(message) {
    debugMessage.value = message;
}
export function appendMessage(message) {
    debugMessage.value += message;
}
