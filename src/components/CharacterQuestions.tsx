export default function CharacterQuestions() {
  return (
    <section
      id="forbered-din-karaktar"
      className="bg-background-elevated px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl text-accent sm:text-4xl">
          Fundera på detta innan vi träffas
        </h2>
        {/* TODO: bygg ut till grupperad, read-only frågelista (ej formulär) —
            familj/relation, varför guilden, dålig egenskap, bra egenskap,
            hemlig dröm, vad karaktären bryr sig om, vad de ser upp till hos andra */}
        <p className="mt-6 text-lg text-muted">
          Frågorna att fundera på listas här.
        </p>
      </div>
    </section>
  );
}
