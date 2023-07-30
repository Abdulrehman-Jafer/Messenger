import { SetStateAction, Dispatch, ChangeEvent } from "react";
export function onChangeHandler<T>(
  event: ChangeEvent,
  setFields: Dispatch<SetStateAction<T>>
) {
  const { name, value } = event.target as HTMLInputElement;
  setFields((prev) => ({ ...prev, [name]: value }));
}

export function findInContact(_id: string, contacts: any[]) {
  return contacts.find((c) => c.contact == _id);
}

export function getLastItem(array: any[]) {
  return array[array.length - 1];
}
