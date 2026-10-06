// SPDX-License-Identifier: MPL-2.0

import { Link } from "@/shared/components/Link";
import PageContainer from "@/shared/layouts/PageContainer";

export default function Thanks() {
  return (
    <PageContainer>
      <h1 className="my-4 text-4xl font-bold">Thank You</h1>
      <h2 className="my-4 text-2xl font-bold">A letter from lead developer u/shen3340</h2>

      <div className="ml-8">
        <p>
          On behalf of the Game Mods and Game Devs, I would like to sincerely thank you for
          participating in the newest iteration of College Football Risk. Without you, the new
          version never could have happened.
        </p>
        <br />
        <p>
          CFBR would not exist without the community that has played it, tested it, challenged it,
          reported bugs, suggested improvements, and continued to come back season after season. The
          game has gone through many iterations, and each one has been shaped by the people who have
          contributed to it.
        </p>
        <br />
        <p>I would espeically like to thank:</p>
        <ul className="list-disc space-y-2 py-4 pl-8">
          <li>All beta testers throughout the process of getting the new site off the ground</li>
          <li>u/BakonyDraco, for the game concept and his perpetual involvement</li>
          <li>u/BlueSCar, for the heavy inspirations behind 3.0</li>
          <li>u/Mautamu, for making the game as it exists today and for his advice</li>
          <li>
            u/The_Ghost_of_TxAg70, for developing the excellent survival guide which has helped many
            teams
          </li>
          <li>
            u/Lokifire42 and u/wassinlj for being great friends and a sounding board throughout the
            development process
          </li>
          <li>
            u/-MrWrightt-, for being a great adviser with respect to strategy and being a good
            friend
          </li>
          <li>u/littlemojo, for developing the inspiration behind the game map</li>
          <li>u/sup3rtom2000, for serving as the wgsec auditor</li>
          <li>
            All those who submitted bug reports, game change ideas, or accessibility reports, or
            contributed in other ways to the advancement of the art
          </li>
        </ul>
        <p>
          Although this community has its flaws, I have met some truly fantastic people in it and
          have made some fantastic memories along the way. I wouldn't even have been a part of this
          community had it not been for u/-MrWrightt- doing some heavy recruiting on the{" "}
          <Link external href="https://www.reddit.com/r/OSU/">
            OSU Subreddit
          </Link>{" "}
          in the middle of 3.0. His messages caused me to join the OSU CFBR discord. It's there
          where I appreciated the community of u/chillygoose, u/mochasaway among others have
          cultivated.
        </p>
        <br />
        <p>
          If I left you out of this, I apologize! There are so <i>many</i> individuals who I want to
          thank for their contributions to the community or the game but I also want to keep this
          readable. Know that your contributions have not gone unnoticed and are much appreciated.
        </p>
        <br />
        <p>
          And now, as CFBR moves into its next chapter, thank you for continuing to be a part of it.
        </p>
        <br />
        <p>
          Sincerely, <br /> u/shen3340
        </p>
      </div>

      <h2 className="my-4 text-2xl font-bold">Donations</h2>
      <p>
        CFBR is hosted and maintained by members of the community. If you would like to help offset
        the costs of hosting and maintaining the game, donations are always appreciated.{" "}
        <Link external href="https://venmo.com/shen3340">
          Donate via Venmo
        </Link>{" "}
      </p>
      <br />
      <p>Thank you for helping keep College Football Risk running.</p>
    </PageContainer>
  );
}
