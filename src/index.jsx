import ForgeUI, { render, Fragment, Text, Button, ButtonSet, useState, useProductContext } from "@forge/ui";
import api from "@forge/api";

const { SENTIMENT_API_KEY, DEBUG_LOGGING } = process.env;

const OPTIONS = [
  ['Date Fact', 'en'],
];

const Panel = () => {
  const { platformContext: { issueKey } } = useProductContext();
  const [fact, setFact] = useState(null);

  async function setFacts(countryCode) {
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    const response = await api.fetch(`http://numbersapi.com/${month}/${date}/date`);
    const fs = (await response.text());
    setFact({
      fact:fs,
    });
  }
  
  // Render the UI
  return (
    <Fragment>
      <ButtonSet>
        {OPTIONS.map(([label, code]) =>
          <Button
            text={label}
            onClick={async () => { await setFacts(code); }}
          />
        )}
      </ButtonSet>
      {fact && (
        <Fragment>
          <Text content={fact.fact} />
        </Fragment>
      )}
    </Fragment>
  );
};

async function checkResponse(apiName, response) {
  if (!response.ok) {
    const message = `Error from ${apiName}: ${response.status} ${await response.text()}`;
    console.error(message);
    throw new Error(message);
  } else if (DEBUG_LOGGING) {
    console.debug(`Response from ${apiName}: ${await response.text()}`);
  }
}

export const run = render(<Panel />);
