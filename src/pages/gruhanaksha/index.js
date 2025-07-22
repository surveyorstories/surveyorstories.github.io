import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("https://surveyorstories.github.io/gruhanakshaweb");
  }, []);

  return null;
}
