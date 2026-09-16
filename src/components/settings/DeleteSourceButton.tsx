"use client";

import { Trash2 } from "lucide-react";
import { deleteGameCategoryAction } from "@/app/actions/gameCategories";
import { deletePlatformAction } from "@/app/actions/platforms";

type Props = {
  id: string;
};

export function DeletePlatformButton({ id }: Props) {
  return (
    <form
      action={deletePlatformAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Delete this platform? Saved sessions will remain and continue to show its name.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button title="Delete platform" aria-label="Delete platform">
        <Trash2 size={16} />
      </button>
    </form>
  );
}

export function DeleteGameCategoryButton({ id }: Props) {
  return (
    <form
      action={deleteGameCategoryAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Delete this game type? All saved sessions using it will remain unchanged.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button title="Delete game type" aria-label="Delete game type">
        <Trash2 size={16} />
      </button>
    </form>
  );
}
