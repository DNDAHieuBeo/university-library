import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";
import { signOut } from "@/auth";
import React from "react";

const Page = () => {
  return (
    <div>
      <form action={async()=>{
        'use server';
        await signOut()
      }} className="mb-10">
        <Button>Logout</Button>
      </form>
      <BookList title="Borrow Books" books={sampleBooks}/>
    </div>
  );
};

export default Page;
