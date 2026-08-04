import { useState } from "react";
import type { FormEvent } from "react";
import PixelModal from "../common/PixelModal";
import PixelInput from "../common/PixelInput";
import PixelButton from "../common/PixelButton";
import { registerStudent } from "../../api/studentsApi";
import type { ClassItem } from "../../types";

interface AddStudentModalProps {
  classItem: ClassItem;
  onClose: () => void;
  // POST /students/register returns { message }, not the created
  // student — callers refetch the roster rather than receiving it back.
  onCreated: () => void;
}

export default function AddStudentModal({
  classItem,
  onClose,
  onCreated,
}: AddStudentModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await registerStudent({
        name,
        email,
        password,
        classId: classItem.id,
      });
      onCreated();
      onClose();
    } catch {
      setError(
        "Couldn't add the student — that email may already be registered."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PixelModal title={`Add Student — ${classItem.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PixelInput
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <PixelInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PixelInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="font-body text-xs text-ember-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <PixelButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </PixelButton>
          <PixelButton type="submit" variant="leaf" disabled={submitting}>
            {submitting ? "Adding…" : "Add student"}
          </PixelButton>
        </div>
      </form>
    </PixelModal>
  );
}