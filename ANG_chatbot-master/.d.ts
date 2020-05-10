export declare function Component(options: ComponentOptions)
: <Instance>(target: new (...args: any[]) => {
    [P in keyof Instance]: Instance[P]
}) => typeof target | void;