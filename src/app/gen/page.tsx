import CodeGenerator from '@/components/CodeGenerator';

export default function Page() {
  return (
    <main className="hero bg-base-300 block min-h-screen p-3 md:p-10">
      <CodeGenerator
        url="https://jsonplaceholder.typicode.com/posts"
        method="POST"
      />
    </main>
  );
}
