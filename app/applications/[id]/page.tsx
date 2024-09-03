export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  return <h1>Hi, {params.id}</h1>;
}