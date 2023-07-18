import { SetStateAction, Dispatch, ChangeEvent } from "react";
export function onChangeHandler<T>(
  event: ChangeEvent,
  setFields: Dispatch<SetStateAction<T>>
) {
  const { name, value } = event.target as HTMLInputElement;
  setFields((prev) => ({ ...prev, [name]: value }));
}
