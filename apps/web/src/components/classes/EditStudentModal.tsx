import { useState } from "react";
import type { FormEvent } from "react";
import PixelModal from "../common/PixelModal";
import PixelInput from "../common/PixelInput";
import PixelButton from "../common/PixelButton";
import { updateStudent } from "../../api/studentsApi";
import type { RosterStudent, UpdateStudentInput } from "../../types";

interface EditStudentModalProps {
  student: RosterStudent;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditStudentModal({
  student,
  onClose,
  onUpdated,
}: EditStudentModalProps) {
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload: UpdateStudentInput = {};
      if (name !== student.name) payload.name = name;
      if (email !== student.email) payload.email = email;
      if (password) payload.password = password;

      await updateStudent(student.id, payload);
      onUpdated();
      onClose();
    } catch {
      setError("Couldn't update this student. Check the fields and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PixelModal title={`Edit Student — ${student.name}`} onClose={onClose} accent="sky">
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
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
        />

        {error && <p className="font-body text-xs text-ember-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <PixelButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </PixelButton>
          <PixelButton type="submit" variant="sky" disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </PixelButton>
        </div>
      </form>
    </PixelModal>
  );
}