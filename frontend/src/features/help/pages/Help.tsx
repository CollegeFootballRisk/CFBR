import PageContainer from "@/shared/layouts/PageContainer";

export default function Help() {
  return (
    <>
      <h1 className="text-4xl font-bold text-center my-4">How to Play</h1>
      <PageContainer>
        <p>
          <a href="/player/The_Ghost_of_TxAg70">The_Ghost_of_TxAg70</a> has drafted an excellent
          Survival Guide. The executive summary is below, but if you would like to see the full
          document, click the
          <a target="_blank" href="/files/CFBRisk_Guide_1_7.pdf" rel="noopener">
            {" "}
            CFBR Risk Survival Guide (PDF)
          </a>
          .
        </p>
        <iframe
          className="block w-full max-w-5xl mx-auto my-2"
          src="/files/ExecutiveSummary.pdf?v=1_7"
          title="Survival Guide"
          height="900px"
        />
        <p>
          More specific details about gameplay are available on the{" "}
          <a href="/info">gameplay information page</a>.
        </p>
        <p>
          By making a move, you agree to play by the <a href="/policies">code of conduct</a> and, if
          this is a test game, you acknowledge to the{" "}
          <a href="/policies#test-game-policy">test game policy.</a>
        </p>
      </PageContainer>
    </>
  );
}
