declare module "nprogress" {
  interface NProgressOptions {
    minimum?: number;
    easing?: string;
    speed?: number;
    trickle?: boolean;
    trickleRate?: number;
    trickleSpeed?: number;
    showSpinner?: boolean;
    parent?: string;
    template?: string;
  }

  interface NProgress {
    configure(options: NProgressOptions): NProgress;
    start(): NProgress;
    done(force?: boolean): NProgress;
    set(n: number): NProgress;
    isStarted(): boolean;
    inc(amount?: number): NProgress;
    remove(): void;
    getStatus(): number | null;
    version: string;
  }

  const nprogress: NProgress;
  export = nprogress;
}
