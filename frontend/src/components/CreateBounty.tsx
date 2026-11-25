import { type FormEvent, useState } from "react";
import type { Address } from "viem";
import { useConnection } from "wagmi";
import type { BountyParams, BountyText } from "../bounty";
import { type BountyFormValues, INITIAL_VALUES, parseBountyForm } from "../bountyForm";
import { appChain } from "../wagmi";
import "./CreateBounty.css";

type TextField = keyof BountyFormValues;

const AMOUNTS: [TextField, string][] = [
  ["reward", "Reward (ETH)"],
  ["submissionBond", "Submission bond (ETH)"],
  ["rejectionBond", "Rejection bond (ETH)"],
  ["disputeBond", "Dispute bond (ETH)"],
];

const PERIODS: [TextField, string][] = [
  ["revealPeriod", "Reveal period (days)"],
  ["decisionPeriod", "Decision period (days)"],
  ["appealPeriod", "Appeal period (days)"],
  ["noticePeriod", "Notice period (days)"],
];

interface Props {
  onCreate: (company: Address, params: BountyParams, text: BountyText) => void;
}

export function CreateBounty({ onCreate }: Props) {
  const { address, chainId } = useConnection();
  const [expanded, setExpanded] = useState(false);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [error, setError] = useState("");
  const [created, setCreated] = useState("");

  if (!address) {
    return <p className="create-hint">Connect a wallet to post a bounty.</p>;
  }
  if (chainId !== appChain.id) {
    return <p className="create-hint">Switch your wallet to {appChain.name} to post a bounty.</p>;
  }
  const company = address;

  function set<K extends keyof BountyFormValues>(field: K, value: BountyFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function close() {
    setExpanded(false);
    setValues(INITIAL_VALUES);
    setError("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const { params, text } = parseBountyForm(values);
      onCreate(company, params, text);
      setCreated(text.title);
      close();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  function input([field, label]: [TextField, string]) {
    return (
      <div className="field" key={field}>
        <label htmlFor={field}>{label}</label>
        <input
          id={field}
          inputMode="decimal"
          value={values[field]}
          onChange={(event) => set(field, event.target.value)}
          required
        />
      </div>
    );
  }

  if (!expanded) {
    return (
      <section className="create-bounty">
        <button
          className="primary create-btn"
          onClick={() => {
            setCreated("");
            setExpanded(true);
          }}
        >
          Create bounty
        </button>
        {created && (
          <p className="create-success" role="status">
            “{created}” was added to the list (mock data, no transaction sent).
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="create-bounty create-bounty-card">
      <div className="create-bounty-header">
        <h2>Create bounty</h2>
        <button className="secondary" onClick={close}>
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="create-bounty-form">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={values.title}
            onChange={(event) => set("title", event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="scope">Scope</label>
          <textarea
            id="scope"
            rows={3}
            value={values.scope}
            onChange={(event) => set("scope", event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="versions">Target versions (one per line)</label>
          <textarea
            id="versions"
            rows={2}
            placeholder="Source commit hash or image digest"
            value={values.versions}
            onChange={(event) => set("versions", event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="knownIssues">Known issues (only the hash is stored)</label>
          <textarea
            id="knownIssues"
            rows={2}
            value={values.knownIssues}
            onChange={(event) => set("knownIssues", event.target.value)}
          />
        </div>

        <div className="field-row">{AMOUNTS.map(input)}</div>
        <div className="field-row">{PERIODS.map(input)}</div>

        {error && (
          <p className="create-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="primary submit-btn">
          Create bounty (mock)
        </button>
      </form>
    </section>
  );
}
