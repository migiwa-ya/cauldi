import React from "react";

type Props = {
  user: string;
  domain: string;
  label?: string;
};

const MailLink = ({ user, domain, label }: Props) => {
  const email = `${user}@${domain}`;
  const mailto = `mailto:${email}`;

  return <a href={mailto}>{label || email}</a>;
};

export default MailLink;
