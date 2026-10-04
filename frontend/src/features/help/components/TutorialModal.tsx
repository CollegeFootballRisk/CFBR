import { useRef, useState } from "react";

import { useAppSettings } from "@/app/useAppSettings";
import { Button } from "@/shared/components/Button";
import { StarIcon } from "@/shared/components/Icons";
import { Modal } from "@/shared/components/Modal";
import { Select } from "@/shared/components/Select";
import { StatusMessage } from "@/shared/components/StatusMessage";
import { Switch } from "@/shared/components/Switch";
import { StarCalculator } from "./StarCalculator";

interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
}

const sections = [
  "Introduction",
  "Objective",
  "Making Moves",
  "Stars",
  "Power",
  "Respawn",
] as const;

type TutorialSection = (typeof sections)[number];

export default function TutorialModal({ open, onClose }: TutorialModalProps) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const section = sections[sectionIndex];

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  const previousSection = () => {
    setSectionIndex((index) => {
      const nextIndex = Math.max(0, index - 1);

      if (nextIndex !== index) {
        requestAnimationFrame(scrollToTop);
      }

      return nextIndex;
    });
  };

  const nextSection = () => {
    setSectionIndex((index) => {
      const nextIndex = Math.min(sections.length - 1, index + 1);

      if (nextIndex !== index) {
        requestAnimationFrame(scrollToTop);
      }

      return nextIndex;
    });
  };

  const selectSection = (value: string) => {
    const index = sections.indexOf(value as TutorialSection);

    if (index !== -1 && index !== sectionIndex) {
      setSectionIndex(index);
      requestAnimationFrame(scrollToTop);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tutorial"
      variant="constrained"
      scrollContainerRef={scrollContainerRef}
      headerActions={
        <TutorialNavigation
          section={section}
          sectionIndex={sectionIndex}
          onPrevious={previousSection}
          onNext={nextSection}
          onSelect={selectSection}
        />
      }
    >
      <div className="space-y-6">
        <div className="mb-12">
          {section === "Introduction" && <IntroductionSection />}
          {section === "Objective" && <ObjectiveSection />}
          {section === "Making Moves" && <MakingMovesSection />}
          {section === "Stars" && <StarsSection />}
          {section === "Power" && <PowerSection />}
          {section === "Respawn" && <RespawnSection />}
        </div>
      </div>
    </Modal>
  );
}

function TutorialNavigation({
  section,
  sectionIndex,
  onPrevious,
  onNext,
  onSelect,
}: {
  section: TutorialSection;
  sectionIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (value: TutorialSection) => void;
}) {
  const options = sections.map((section) => ({
    label: section,
    value: section,
  }));

  return (
    <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-center">
      <Button
        variant="secondary"
        onClick={onPrevious}
        disabled={sectionIndex === 0}
        className="w-full sm:w-auto"
      >
        Previous
      </Button>

      <Button
        variant="secondary"
        onClick={onNext}
        disabled={sectionIndex === sections.length - 1}
        className="order-2 w-full sm:order-3 sm:w-auto"
      >
        Next
      </Button>

      <div className="order-3 col-span-2 min-w-0 sm:order-2 sm:w-auto">
        <Select
          value={section}
          options={options}
          onChange={(value) => {
            if (value !== "") {
              onSelect(value as TutorialSection);
            }
          }}
        />
      </div>
    </div>
  );
}
function IntroductionSection() {
  return (
    <section className="space-y-4">
      <p>Welcome to College Football Risk!</p>

      <p>
        Whether this is your first game or you've been here since the beginning, we appreciate that
        you've chosen to play this game. This tutorial will cover some of the basic topics of
        gameplay. Ready to get started?
      </p>
    </section>
  );
}

function ObjectiveSection() {
  return (
    <section className="space-y-4">
      <p>
        The objective of College Football Risk is for your team to{" "}
        <i>own the most territories on the map</i>. There are 131 teams, corresponding to the 130
        teams in the FBS + a special team called Chaos.
      </p>
    </section>
  );
}

function MakingMovesSection() {
  const { settings, updateSetting } = useAppSettings();
  const [submissionResult, setSubmissionResult] = useState<"success" | "failure">("success");
  return (
    <section className="space-y-4">
      <p>
        Each turn, you can make a move on a single territory. There are two different ways to do so:
      </p>
      <ul className="list-decimal space-y-2 pl-5">
        <li>
          By clicking on a territory your team owns or that neighbors a territory your team owns and
          then clicking Attack or Defend in the sidebar
        </li>
        <li>
          By clicking the target icon, labeled "Your Move" and selecting one of the territories you
          can Attack or Defend
        </li>
      </ul>
      <p>
        Once you've submitted your move{" "}
        <span className="inline-block align-middle">
          <Select
            value={submissionResult}
            options={[
              { label: "successfully", value: "success" },
              { label: "unsuccessfully", value: "failure" },
            ]}
            onChange={(value) => {
              if (value === "success" || value === "failure") {
                setSubmissionResult(value);
              }
            }}
          />
        </span>
        , you'll see the below prompt:
      </p>
      {submissionResult === "success" ? (
        <StatusMessage status="success" title="Move Submitted">
          <p>Your move on %TERRITORY% has been successfully made.</p>
        </StatusMessage>
      ) : (
        <StatusMessage status="failure" title="Move Failed to Submit">
          <p>Your move on %TERRITORY% could not be submitted. Please try again.</p>
        </StatusMessage>
      )}
      <p>
        If your move submitted successfully, you're now good to sit back and wait for the roll to
        happen at 10:30 ET. (<b>Note:</b> <i>No rolls occur on Sundays!</i>)
      </p>
      <p>
        Additionally, the territory on which you have moved can pulse if you enable the setting.
        While you could go to settings to enable it, you can also enable it here:
      </p>
      <div className="border-y py-4">
        <div className="flex items-center justify-center gap-4">
          <Switch
            aria-label="Show territory fade/pulse"
            checked={settings.showPulseTerritory}
            onCheckedChange={(value) => updateSetting("showPulseTerritory", value)}
          />
          <span className="text-sm">Fade/pulse the territory in and out on which I am moving</span>
        </div>
      </div>
    </section>
  );
}

function StarsSection() {
  return (
    <section className="space-y-4">
      <p>
        As you submit more moves and gain experience, you may occasionally be the one who wins a
        territory for your team, in other words, you're the MVP!
      </p>

      <p>
        To commemorate the moment, your profile will reflect this by showing a star next to that
        move: <StarIcon />
      </p>

      <p>
        But that's not all! The MVP will also level you up! As you gain more MVPs, you go from one
        star to up to five stars.
      </p>

      <p>
        Even if you don't win MVP, your participation also helps you to level up! Maintaining a
        streak and playing more turns both this game and in all games is rewarded by increasing each
        of those category's rankings from one to five stars.
      </p>

      <p>
        As you level up in each star category, your overall ranking also improves, as it's the
        rounded-up median of your stars. For example, if you had 2 stars in the MVP category, 2 in
        round turns, 4 in total turns, and 4 in streak, you'd be a 3-star overall.
      </p>

      <StarCalculator />
    </section>
  );
}

function PowerSection() {
  const [stars, setStars] = useState(1);
  const [regions, setRegions] = useState(0);
  const [action, setAction] = useState("attack");
  const [tripleOrNothing, setTripleOrNothing] = useState("no");

  const actionMultiplier = action === "defend" ? 1.5 : 1;
  const regionMultiplier = 1 + regions * 0.5;

  const tripleMultiplier = tripleOrNothing === "win" ? 3 : tripleOrNothing === "lose" ? 0 : 1;

  const multiplier = actionMultiplier * regionMultiplier * tripleMultiplier;
  const weight = stars;
  const power = weight * multiplier;

  return (
    <section className="space-y-4">
      <p>
        You may now be asking, why does my star ranking matter? The answer is that it determines
        your likelihood of winning a territory for your team, in other words, your power.
      </p>

      <p>
        <b>Power = Weight ✕ Multipliers</b>
      </p>

      <p>
        Your <i>weight</i> is currently equal to your star rank, so if you are overall a three-star
        player, then your weight is 3.
      </p>

      <p>
        But now we arrive at the <i>multiplier</i>. Multipliers are a factor of the following:
      </p>

      <ul className="list-disc space-y-2 pl-5 text-left">
        <li>
          Whether you're defending a territory your team owns or attacking a territory that
          neighbors a territory your team owns
          <ul className="list-[circle] space-y-1 pl-8">
            <li>Attacking gives a multiplier of 1</li>
            <li>Defending gives a multiplier of 1.5</li>
          </ul>
        </li>

        <li>
          The number of regions your team holds
          <ul className="list-[circle] space-y-1 pl-8">
            <li>
              Each region (a grouping of territories) your team owns in its entirety gives a 0.5
              multiplier boost, e.g. no regions gives a multiplier of 1, while 2 regions gives a
              multiplier of 2
            </li>
          </ul>
        </li>

        <li>
          Whether you win triple-or-nothing
          <ul className="list-[circle] space-y-1 pl-8">
            <li>
              If your team is down to a single territory (and it's not the first three or last three
              turns), each player on that team can decide whether to triple their power or lose all
              of it. If you take the wager, you might have a multiplier of 3, or 0; both are
              weighted equally.
            </li>
          </ul>
        </li>
      </ul>

      <p>You can use the below calculator to see what power would come out:</p>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <span>Stars for the player:</span>
          <Select
            value={stars}
            options={[
              { label: "1", value: 1 },
              { label: "2", value: 2 },
              { label: "3", value: 3 },
              { label: "4", value: 4 },
              { label: "5", value: 5 },
            ]}
            onChange={(value) => {
              if (value !== "") {
                setStars(value);
              }
            }}
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <span>Regions held by player's team:</span>
          <Select
            value={regions}
            options={[
              { label: "0", value: 0 },
              { label: "1", value: 1 },
              { label: "2", value: 2 },
              { label: "3", value: 3 },
              { label: "4", value: 4 },
            ]}
            onChange={(value) => {
              if (value !== "") {
                setRegions(value);
              }
            }}
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <span>Attacking or defending?</span>
          <Select
            value={action}
            options={[
              { label: "Attacking", value: "attack" },
              { label: "Defending", value: "defend" },
            ]}
            onChange={setAction}
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <span>Triple or Nothing?</span>
          <Select
            value={tripleOrNothing}
            options={[
              { label: "No", value: "no" },
              { label: "Yes - Win", value: "win" },
              { label: "Yes - Lose", value: "lose" },
            ]}
            onChange={setTripleOrNothing}
          />
        </div>

        <div className="space-y-1 text-center">
          <p>Power = {power}</p>
          <p>Multiplier = {multiplier}</p>
          <p>Weight = {weight}</p>
        </div>
      </div>
    </section>
  );
}

function RespawnSection() {
  return (
    <section className="space-y-4">
      <p>
        Should a team be eliminated, that team may respawn on a respawn map up to one time. The
        respawn map will have a collection of territories, originally owned by the NCAA, which
        follow the same rules as the main map with one exception: teams that win more than one
        territory may be required to forfeit all but one territory on the map in a given turn if
        team(s) are eliminated on the main map. A random pool of territories is created of NCAA's
        territories and all but one of the territories owned by each team that owns more than one
        territory. Those territories are then assigned to newly-eliminated teams until each
        newly-eliminated team has a territory on the respawn map. If there are insufficient
        territories, then any remaining eliminated teams are permanently eliminated. Random bridges
        will be occasionally drawn from the respawn map to the main map. A team which succeeds in
        crossing such a bridge forfeits all territories on the respawn map but re-enters the main
        map until eliminated or the game ends. For respawn, the order of execution is as follows:
      </p>

      <ol className="list-decimal space-y-3 pl-5 text-left">
        <li>We process submap 0 (the main map) as normal</li>

        <li>
          We determine which team(s) were eliminated on the main map and which have not yet used any
          respawns (teams.respawn_count &lt; 1)
        </li>

        <li>
          If any teams have previously been on submap id 1 but are now present on submap 0, then we
          discard any turns made on submap id 1 by players on those teams
        </li>

        <li>
          We process submap 1 (the secondary map), assigning the protected territories of any team
          which has succesfully returned to submap 0 to the NCAA (team id 0)
        </li>

        <li>We randomly shuffle the eligible eliminated teams</li>

        <li>
          We take all submap 1 territories owned by NCAA and add them to a pool of re-assignable
          territories
        </li>

        <li>
          We take all teams that own more than one territory on submap 1 and select all but one of
          their territories to add to the pool of re-assignable territories randomly (but all such
          territories will be placed after any NCAA territories to ensure NCAA territories are
          exhausted first)
        </li>

        <li>
          We reassign the territories from the re-assignable pool until either it is exhausted or
          all respawn-eligible teams have recevied a single territory
        </li>

        <li>We merge all results from all submaps and write it to the database</li>
      </ol>
    </section>
  );
}
