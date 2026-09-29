export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <article className="prose prose-slate max-w-none dark:prose-invert">
        <h1>How to Play</h1>

        <p>
          College Football Risk is a territory-control strategy game where
          players work together to conquer and defend territories on the map.
        </p>

        <h2>Getting Started</h2>

        <p>
          Choose a team and join the game. Each turn, you can submit a move to
          help your team attack or defend territories.
        </p>

        <h2>Turns</h2>

        <p>
          Every turn represents another round of the game. Your submitted move
          contributes power to your team and territory.
        </p>

        <h2>Territories</h2>

        <p>
          Territories are controlled by teams. Teams can attack adjacent
          territories and defend territories they already control.
        </p>

        <h2>Winning</h2>

        <p>
          Teams compete to control territories and accumulate points throughout
          the season.
        </p>
      </article>
    </div>
  );
}
