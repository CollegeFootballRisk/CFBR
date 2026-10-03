import PageContainer from "@/shared/layouts/PageContainer";

export default function Policies() {
  return (
    <>
      <h1 className="my-4 text-center text-4xl font-bold">Code of Conduct</h1>

      <PageContainer>
        <ol className="list-decimal space-y-4 pl-6">
          <li>
            <strong>Don't be a Jerk:</strong> This is our catch-all, our most important rule.
            Whatever you have to say, you can say in a way that shows respect to the other people in
            this server. If someone wants to be left alone, leave them alone, even if you think
            you're right. If you can't keep yourself from being abrasive, you shouldn't participate.
          </li>

          <li>
            <strong>Contribute Positively:</strong> We're here to have fun; general chat, generally,
            is for anything and everything. However, keep conversation in other channels relevant to
            their channel topics, especially more serious channels like those for game discussion.
          </li>

          <li>
            <strong>No Politics:</strong> Political discussions almost never make an online
            community healthier, and we're not going to tempt fate.
          </li>

          <li>
            <strong>No Bigotry:</strong> Hateful comments on the basis of race, religion,
            nationality, gender, age, disability, sexual orientation or other similar
            characteristics will not be tolerated.
          </li>

          <li>
            <strong>No Soliciting, Advertising, Or Spamming:</strong> This is not a commercial
            forum. Spamming is the practice of sending repeated unsolicited, unwanted messages,
            often of low quality.
            <br />
            If you are a spam bot, you will be summarily executed in the square.
          </li>

          <li>
            <strong>Respect Others' Privacy:</strong> Do not post personal information about other
            people without their consent.
          </li>

          <li>
            <strong>Show Restraint:</strong> If someone violates the rules, do not try to police
            them yourself; contact the administrators and let us handle any discipline. While we
            appreciate your vigilance, the administrators have procedures to ensure that each
            violation is investigated promptly and resolved appropriately.
          </li>

          <li>
            <strong>No baiting:</strong> If you try to provoke somebody to break these rules to
            bring discipline upon them, you may be subject to discipline as well.
          </li>
        </ol>

        <h2 id="test-game-policy" className="my-4 text-center text-4xl font-bold">
          Test Game Policy
        </h2>

        <p>
          Test games are, by their nature, dynamic; therefore, by playing during a test game, you
          consent to mid-game changes to the UI, the API, gameplay/game rules, and other similar
          elements pertinent to the game, with or without advanced notice. Furthermore, you agree
          not to make unfounded and/or overblown complaints about test game changes.
        </p>
      </PageContainer>
    </>
  );
}
