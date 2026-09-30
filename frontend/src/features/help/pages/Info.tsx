import PageContainer from "@/shared/layouts/PageContainer";

export default function Info() {
  return (
    <>
      <h1 className="my-4 text-center text-4xl font-bold">Information</h1>
      <h2 className="my-4 text-center text-2xl font-bold">
        Playing College Football Risk
      </h2>
      <PageContainer>
        <h3 className="mb-2 text-xl font-bold">
          What is College Football Risk?
        </h3>
        <p className="mb-4">
          College Football Risk is a multiplayer game where teams can work
          together to control a map of North America. The objective is for a
          team to have the largest number of territories of any team at the end
          of the season. College Football Risk is a continuation of a popular
          CFB Risk game run by{" "}
          <a
            href="https://www.reddit.com/r/CFB"
            target="_blank"
            rel="noreferrer"
          >
            r/CFB
          </a>{" "}
          in the Spring and Summer of 2018, by{" "}
          <a
            href="https://www.reddit.com/user/BlueSCar"
            target="_blank"
            rel="noreferrer"
          >
            BlueSCar
          </a>{" "}
          in the Spring of 2020, and by{" "}
          <a
            href="https://www.reddit.com/user/Mautamu/"
            target="_blank"
            rel="noreferrer"
          >
            Mautamu
          </a>{" "}
          in 2023. It is an MMO-style game where college football fanbases
          compete for control of a fictionalized map of the United States. The
          goal is to control as much territory as possible for ultimate
          domination of the map.
        </p>

        <h3 className="mb-2 text-xl font-bold">How do I play?</h3>
        <p className="mb-4">
          Once a day, visit the site and choose a territory to defend or attack.
          Most of the fun comes from coordinating with others on your team. A
          lot of teams have communities set up to coordinate strategy, usually
          in the form of a subreddit or Discord channel. Find yours and
          participate!
          <br />
          By making a move, you agree to play by the{" "}
          <a href="/policies">code of conduct</a> and, if this is a test game,
          you acknowledge and agree to the{" "}
          <a href="/policies#test-game-policy">test game policy</a>.
        </p>

        <h3 className="mb-2 text-xl font-bold">How does the game work?</h3>
        <p className="mb-4">
          Every day at 21:30 U.S. Central Standard Time, the map is redrawn. For
          each territory on the map, the total{" "}
          <a href="#starpower">starpower</a> is calculated for each team that
          made moves in that territory. A random number is drawn and the team
          whose player that number corresponds to is labeled{" "}
          <a href="#mvp">MVP</a> and wins the territory for that team.
        </p>

        <h3 className="mb-2 text-xl font-bold">What multipliers are there?</h3>

        <p className="mb-2">The multipliers are as follows:</p>

        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Region Multiplier:</strong> A team can receive a multiplier
            of 1.0 + 0.5 × the number of regions owned. For example, if a team
            holds all of the territories in two regions, they get a 2.0
            multiplier.
          </li>

          <li>
            <strong>Defense:</strong> A player can receive a multiplier of 1.5
            for defending a territory their team already owns.
          </li>

          <li>
            <strong>Triple-or-Nothing:</strong> A player on a team with just one
            territory gets to gamble between having a multiplier of 1, 3, or 0.
            If the player chooses not to participate, the multiplier does not
            come into effect for that user.
          </li>
        </ul>

        <p className="mb-4">
          Multipliers are multiplicative, so a defender with a single regional
          multiplier would have (1.5) × (1.0 + 0.5) = 2.25 multiplier. This is
          then multiplied by their star number to determine their overall power.
        </p>

        <h3 className="mb-2 text-xl font-bold">
          How can I participate in the community and/or find my team's central
          command?
        </h3>

        <p className="mb-4">
          We mainly use Discord for our team's community and central command.
          This is our{" "}
          <a
            href="https://discord.gg/NwXjDS7mGN"
            target="_blank"
            rel="noreferrer"
          >
            official Discord server
          </a>
          where you can find teams and then be invited to your corresponding
          team servers.
        </p>

        <h3 className="mb-2 text-xl font-bold">
          How is this different from older versions of College Football Risk?
        </h3>

        <p className="mb-2">
          This game is quite similar to older versions of CFBR. However, it
          differs in the following ways:
        </p>

        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Significantly larger map</strong> – Canada, Mexico, and the
            Caribbean were added, 51 territories in all.
          </li>

          <li>
            <strong>Colonizable Territory</strong> – Grab free land while it's
            hot!
          </li>

          <li>
            <strong>3-Turn Head Start for most teams</strong> – Some teams start
            in a harder spot than others. Use this head start to gobble up a
            region quickly, or just to get the heck out of there! (Note: this
            means that surviving teams from the last game can only defend for
            the first 3 turns, and Stanford for the 1st Turn, in an effort to
            give smaller teams a chance to survive the first few turns)
          </li>

          <li>
            <strong>Region Bonuses</strong> – Like Continent bonuses in real
            Risk, in this case your whole team gets a power multiplier for
            holding a region of territories
          </li>

          <li>
            <strong>Permanent mercenaries (Transfer portal)</strong> – You can
            now choose to permanently join another team if yours is eliminated.
            So be nice to teams with their back against the wall, maybe their
            players will join you! And be careful what team you kill…they may
            make your enemies stronger.
          </li>

          <li>
            <strong>New Chaos mechanics</strong> – Chaos, based in Bermuda, can
            now attack a completely random set of territories every turn.
            Nowhere is safe!
          </li>

          <li>
            <strong>Sunday Breaks</strong> – Can still place your move for 48
            hours
          </li>

          <li>
            <strong>3x Or Nothing Bonus if facing elimination</strong> – Do you
            only have one territory left? Gamble it all with a 50% chance to
            either multiply your star power by 3, or by zero!
          </li>

          <li>
            <strong>More map bridges/ferries</strong> – move around the map
            quicker than ever and limit “safe corners”
          </li>

          <li>
            <strong>Star power tweaks</strong> – The 'power' gap between 5-star
            players and 1-star players has been reduced
          </li>

          <li>
            <strong>New User Interface</strong> – Even has customizable
            backgrounds!
          </li>

          <li>
            <strong>Open Source</strong> – This version of the game is entirely
            open-source. Anyone can go look at its{" "}
            <a
              href="https://github.com/collegefootballrisk/cfbr"
              target="_blank"
              rel="noreferrer"
            >
              code
            </a>{" "}
            , and submit pull requests to change the game.
            <br />
            The backend version is written in Python with FastAPI and the
            frontend is written in React/Typescript.
          </li>
        </ul>

        <h3 className="mb-2 text-xl font-bold">Gameplay</h3>

        <p className="mb-4">
          For each turn, if a team controls only one territory, each player is
          granted the ability to triple or nothing their power. This means that
          teams which are on the verge of being eliminated may be able to
          recuperate some of their ability to strike back and allow time to
          strategize or recruit.
        </p>

        <p className="mb-4">
          Finally, all players on a dead team are prompted to join a new team.
          They may choose to join Chaos as well.
        </p>

        <h3 className="mb-2 text-xl font-bold">
          How do I get stars / move up in rank?
        </h3>

        <p className="mb-2">
          Your total/overall starcount is the <i>median</i> of your stars for
          each of the following categories:
        </p>

        <ul className="mb-4 list-disc space-y-4 pl-6">
          <li>
            <strong>MVPs</strong> (when you are the MVP of a territory):
            <ul className="list-circle mt-2 list-inside space-y-1 pl-4">
              <li>0 MVPs: 1 Star</li>
              <li>1–4 MVPs: 2 Stars</li>
              <li>5–9 MVPs: 3 Stars</li>
              <li>10–24 MVPs: 4 Stars</li>
              <li>25+ MVPs: 5 Stars</li>
            </ul>
          </li>

          <li>
            <strong>Turns</strong> (how many turns you've had in all College
            Football Risk games):
            <ul className="list-circle mt-2 list-inside space-y-1 pl-4">
              <li>0–9 Turns: 1 Star</li>
              <li>10–24 Turns: 2 Stars</li>
              <li>25–49 Turns: 3 Stars</li>
              <li>50–99 Turns: 4 Stars</li>
              <li>100+ Turns: 5 Stars</li>
            </ul>
          </li>

          <li>
            <strong>Game Turns</strong> (all the turns you've made in this
            game):
            <ul className="list-circle mt-2 list-inside space-y-1 pl-4">
              <li>0–4 Turns: 1 Star</li>
              <li>5–9 Turns: 2 Stars</li>
              <li>10–24 Turns: 3 Stars</li>
              <li>25–39 Turns: 4 Stars</li>
              <li>40+ Turns: 5 Stars</li>
            </ul>
          </li>

          <li>
            <strong>Streak</strong> (how many consecutive turns you've made):
            <ul className="list-circle mt-2 list-inside space-y-1 pl-4">
              <li>0–2 Turns: 1 Star</li>
              <li>3–4 Turns: 2 Stars</li>
              <li>5–9 Turns: 3 Stars</li>
              <li>10–24 Turns: 4 Stars</li>
              <li>25+ Turns: 5 Stars</li>
            </ul>
          </li>
        </ul>

        <h3 className="mb-2 text-xl font-bold">Survival Guide</h3>

        <p className="mb-4">
          <a href="/player/The_Ghost_of_TxAg70">TxAg70</a> has put together a
          wonderful guide for how teams can dominate in CFBR. CFBR is grateful
          to him for putting it together. You can view it below or{" "}
          <a
            href="/files/CFBRisk_Guide_1_7.pdf"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </p>

        <iframe
          className="mx-auto block w-full max-w-5xl"
          src="/files/CFBRisk_Guide_1_7.pdf"
          title="Survival Guide"
          height="900px"
        />
      </PageContainer>
    </>
  );
}
