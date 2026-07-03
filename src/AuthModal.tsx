import { Authenticator } from "@aws-amplify/ui-react";

type Props = { onClose: () => void };

export function AuthModal({ onClose }: Props) {
  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="auth-modal__head">
          <h2 className="auth-modal__title">Sign in to save</h2>
          <p className="auth-modal__sub">
            Sync your invoices to your account. Any drafts you started here come
            with you.
          </p>
        </div>
        {/* Once authenticated, the Authenticator renders its children (empty);
            the parent closes this modal on the auth-status change. */}
        <Authenticator>{() => <></>}</Authenticator>
      </div>
    </div>
  );
}
