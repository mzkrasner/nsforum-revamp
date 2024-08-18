import React from "react";

export const combineComponents = (...components: any[]) => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) => {
      // eslint-disable-next-line react/display-name
      return ({ children }: React.PropsWithChildren) => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }: React.PropsWithChildren) => <>{children}</>,
  );
};

combineComponents.displayName = combineComponents;
