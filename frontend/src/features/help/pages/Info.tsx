import type { ReactNode } from "react";
import { Link } from "@/shared/components/Link";
import PageContainer from "@/shared/layouts/PageContainer";
import { StarCalculator } from "../components/StarCalculator";

interface InfoSectionProps {
  title: string;
  children: ReactNode;
}

interface GameDifference {
  title: string;
  description: ReactNode;
}

const gameDifferences: GameDifference[] = [
  {
    title: "Significantly larger map",
    description: "Canada, Mexico, and the Caribbean were added, 51 territories in all.",
  },
  {
    title: "Colonizable Territory",
    description: "Grab free land while it's hot!",
  },
  {
    title: "3-Turn Head Start for most teams",
    description:
      "Some teams start in a harder spot than others. Use this head start to gobble up a region quickly, or just to get the heck out of there! Surviving teams from the last game can only defend for the first 3 turns, and Stanford for the 1st Turn, in an effort to give smaller teams a chance to survive the first few turns.",
  },
  {
    title: "Region Bonuses",
    description:
      "Like Continent bonuses in real Risk, your whole team gets a power multiplier for holding a region of territories.",
  },
  {
    title: "Permanent mercenaries (Transfer portal)",
    description:
      "You can now choose to permanently join another team if yours is eliminated. Be nice to teams with their back against the wall, maybe their players will join you! And be careful what team you kill—they may make your enemies stronger.",
  },
  {
    title: "New Chaos mechanics",
    description:
      "Chaos, based in Bermuda, can now attack a completely random set of territories every turn. Nowhere is safe!",
  },
  {
    title: "Sunday Breaks",
    description: "Can still place your move for 48 hours.",
  },
  {
    title: "3x Or Nothing Bonus if facing elimination",
    description:
      "Do you only have one territory left? Gamble it all with a 50% chance to either multiply your star power by 3, or by zero!",
  },
  {
    title: "More map bridges/ferries",
    description: "Move around the map quicker than ever and limit safe corners.",
  },
  {
    title: "Star power tweaks",
    description: "The power gap between 5-star players and 1-star players has been reduced.",
  },
  {
    title: "New User Interface",
    description: "Even has customizable backgrounds!",
  },
  {
    title: "Open Source",
    description: (
      <>
        This version of the game is entirely open-source. Anyone can look at its{" "}
        <Link external href="https://github.com/CollegeFootballRisk/cfbr">
          code
        </Link>{" "}
        and submit pull requests to change the game. The backend is written in Python with FastAPI
        and the frontend is written in React/TypeScript.
      </>
    ),
  },
];

function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <section className="mb-6">
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      {children}
    </section>
  );
}

function GameOverview() {
  return (
    <>
      <InfoSection title="What is College Football Risk?">
        <p className="mb-4">
          College Football Risk is a multiplayer game where teams can work together to control a map
          of North America. The objective is for a team to have the largest number of territories of
          any team at the end of the season. College Football Risk is a continuation of a popular
          CFB Risk game run by{" "}
          <Link href="https://www.reddit.com/r/CFB" target="_blank" rel="noopener noreferrer">
            r/CFB
          </Link>{" "}
          in the Spring and Summer of 2018, by{" "}
          <Link external href="https://www.reddit.com/user/BlueSCar">
            BlueSCar
          </Link>{" "}
          in the Spring of 2020, and by{" "}
          <Link external href="https://www.reddit.com/user/Mautamu/">
            Mautamu
          </Link>{" "}
          in 2023. It is an MMO-style game where college football fanbases compete for control of a
          fictionalized map of the United States. The goal is to control as much territory as
          possible for ultimate domination of the map.
        </p>
      </InfoSection>

      <InfoSection title="How do I play?">
        <p className="mb-4">
          Once a day, visit the site and choose a territory to defend or attack. Most of the fun
          comes from coordinating with others on your team. A lot of teams have communities set up
          to coordinate strategy, usually in the form of a subreddit or Discord channel. Find yours
          and participate!
          <br />
          By making a move, you agree to play by the <Link href="/policies">code of conduct</Link>{" "}
          and, if this is a test game, you acknowledge and agree to the{" "}
          <Link href="/policies#test-game-policy">test game policy</Link>.
        </p>
      </InfoSection>

      <InfoSection title="How can I participate in the community and/or find my team's central command?">
        <p className="mb-4">
          We mainly use Discord for our team's community and central command. This is our{" "}
          <Link href="https://discord.gg/NwXjDS7mGN" target="_blank" rel="noopener noreferrer">
            official Discord server
          </Link>{" "}
          where you can find teams and then be invited to your corresponding team servers.
        </p>
      </InfoSection>
    </>
  );
}

function GameRules() {
  return (
    <>
      <InfoSection title="How does the game work?">
        <p className="mb-4">
          Every day at 22:30 U.S. Eastern Standard Time, the map is redrawn. For each territory on
          the map, the total <Link href="#starpower">starpower</Link> is calculated for each team
          that made moves in that territory. A random number is drawn and the team whose player that
          number corresponds to is labeled <Link href="#mvp">MVP</Link> and wins the territory for
          that team.
        </p>
      </InfoSection>

      <InfoSection title="What multipliers are there?">
        <p className="mb-2">The multipliers are as follows:</p>

        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Region Multiplier:</strong> A team can receive a multiplier of 1.0 + 0.5 × the
            number of regions owned. For example, if a team holds all of the territories in two
            regions, they get a 2.0 multiplier.
          </li>

          <li>
            <strong>Defense:</strong> A player can receive a multiplier of 1.5 for defending a
            territory their team already owns.
          </li>

          <li>
            <strong>Triple-or-Nothing:</strong> A player on a team with just one territory gets to
            gamble between having a multiplier of 1, 3, or 0. If the player chooses not to
            participate, the multiplier does not come into effect for that user.
          </li>
        </ul>

        <p className="mb-4">
          Multipliers are multiplicative, so a defender with a single regional multiplier would have
          (1.5) × (1.0 + 0.5) = 2.25 multiplier. This is then multiplied by their star number to
          determine their overall power.
        </p>
      </InfoSection>

      <InfoSection title="Gameplay">
        <p className="mb-4">
          For each turn, if a team controls only one territory, each player is granted the ability
          to triple or nothing their power. This means that teams which are on the verge of being
          eliminated may be able to recuperate some of their ability to strike back and allow time
          to strategize or recruit.
        </p>

        <p className="mb-4">
          Finally, all players on a dead team are prompted to join a new team. They may choose to
          join Chaos as well.
        </p>
      </InfoSection>
    </>
  );
}

function GameDifferences() {
  return (
    <InfoSection title="How is this different from older versions of College Football Risk?">
      <p className="mb-2">
        This game is quite similar to older versions of CFBR. However, it differs in the following
        ways:
      </p>

      <ul className="mb-4 list-disc space-y-2 pl-6">
        {gameDifferences.map((difference) => (
          <li key={difference.title}>
            <strong>{difference.title}</strong> – {difference.description}
          </li>
        ))}
      </ul>
    </InfoSection>
  );
}

function Stars() {
  return (
    <InfoSection title="How do I get stars / move up in rank?">
      <StarCalculator />
    </InfoSection>
  );
}

function SurvivalGuide() {
  return (
    <InfoSection title="Survival Guide">
      <p className="mb-4">
        <Link href="/player/The_Ghost_of_TxAg70">TxAg70</Link> has put together a wonderful guide
        for how teams can dominate in CFBR. CFBR is grateful to him for putting it together. You can
        view it below or{" "}
        <Link external href="/files/CFBRisk_Guide_1_7.pdf" aria-label="CFBR Survival Guide">
          Open the Survival Guide PDF
        </Link>
        .
      </p>

      <iframe
        className="mx-auto block w-full max-w-5xl"
        src="/files/CFBRisk_Guide_1_7.pdf"
        title="Survival Guide"
        height="900"
      />
    </InfoSection>
  );
}

export default function Info() {
  return (
    <>
      <h1 className="my-4 text-center text-4xl font-bold">Information</h1>

      <h2 className="my-4 text-center text-2xl font-bold">Playing College Football Risk</h2>

      <PageContainer>
        <GameOverview />
        <GameRules />
        <GameDifferences />
        <Stars />
        <SurvivalGuide />
      </PageContainer>
    </>
  );
}
