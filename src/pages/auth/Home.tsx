import React from 'react';
import Welcome from "@/components/home/Welcome.tsx";

const Home: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center space-y-2 mt-2">
         <Welcome />

      <footer className="w-full py-4 text-center bg-muted/40 mt-4 border-t"> {/* Fond vert foncé */}
        <p className="text-sm text-foreground">
          &copy; {new Date().getFullYear()} Aka-code.
        </p>
      </footer>
    </div>
  );
};

export default Home;
