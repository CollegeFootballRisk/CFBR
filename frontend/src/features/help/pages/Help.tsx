import { Link } from "@/shared/components/Link";
import PageContainer from "@/shared/layouts/PageContainer";

export default function Help() {
  return (
    <>
      <h1 className="my-4 text-center text-4xl font-bold">How to Play</h1>

      <PageContainer>
        <p>
          <Link href="/player/The_Ghost_of_TxAg70">The_Ghost_of_TxAg70</Link> has drafted an
          excellent Survival Guide. The executive summary is below, but if you would like to see the
          full document, click the{" "}
          <Link external href="/files/CFBRisk_Guide_1_7.pdf">
            CFBR Risk Survival Guide (PDF)
          </Link>
          .
        </p>

        <iframe
          className="mx-auto my-2 block w-full max-w-5xl"
          src="/files/ExecutiveSummary.pdf?v=1_7"
          title="Survival Guide"
          height="900px"
        />

        <p>
          More specific details about gameplay are available on the{" "}
          <Link href="/info">gameplay information page</Link>.
        </p>

        <p>
          By making a move, you agree to play by the <Link href="/policies">code of conduct</Link>{" "}
          and, if this is a test game, you acknowledge to the{" "}
          <Link href="/policies#test-game-policy">test game policy.</Link>
        </p>
      </PageContainer>
    </>
  );
}
