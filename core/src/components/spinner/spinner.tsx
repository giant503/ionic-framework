import { Component, Prop } from '@stencil/core';
import { Color, Config, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';
import { SPINNERS, SpinnerConfig } from './spinner-configs';


@Component({
  tag: 'ion-spinner',
  styleUrls: {
    ios: 'spinner.ios.scss',
    md: 'spinner.md.scss'
  },
  shadow: true
})
export class Spinner {
  @Prop({ context: 'config' }) config!: Config;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * Duration of the spinner animation in milliseconds. The default varies based on the spinner.
   */
  @Prop() duration?: number;

  /**
   * The name of the SVG spinner to use. If a name is not provided, the platform's default
   * spinner will be used. Possible values are: `"lines"`, `"lines-small"`, `"dots"`, `"bubbles"`,
   * `"circles"`, `"crescent"`.
   */
  @Prop() name?: string;

  /**
   * If true, the spinner's animation will be paused. Defaults to `false`.
   */
  @Prop() paused = false;


  private getName(): string {
    let name = this.name || this.config.get('spinner');
    if (!name) {
      // fallback
      if (this.mode === 'md') {
        return 'crescent';
      } else {
        return 'lines';
      }
    }
    if (name === 'ios') {
      // deprecation warning, renamed in v4
      console.warn(`spinner "ios" has been renamed to "lines"`);
      name = 'lines';
    } else if (name === 'ios-small') {
      // deprecation warning, renamed in v4
      console.warn(`spinner "ios-small" has been renamed to "lines-small"`);
      name = 'lines-small';
    }
    return name;
  }

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),

        [`spinner-${this.getName()}`]: true,
        'spinner-paused': !!this.paused
      }
    };
  }

  render() {
    const name = this.getName();

    const spinner = SPINNERS[name] || SPINNERS['lines'];
    const duration = (typeof this.duration === 'number' && this.duration > 10 ? this.duration : spinner.dur);
    const svgs: any[] = [];

    if (spinner.circles) {
      for (let i = 0; i < spinner.circles; i++) {
        svgs.push(buildCircle(spinner, duration, i, spinner.circles));
      }

    } else if (spinner.lines) {
      for (let i = 0; i < spinner.lines; i++) {
        svgs.push(buildLine(spinner, duration, i, spinner.lines));
      }
    }

    return svgs;
  }
}


function buildCircle(spinner: SpinnerConfig, duration: number, index: number, total: number) {
  const data = spinner.fn(duration, index, total);
  data.style['animation-duration'] = `${duration}ms`;

  return (
    <svg viewBox="0 0 64 64" style={data.style}>
      <circle transform="translate(32,32)" r={data.r}></circle>
    </svg>
  );
}


function buildLine(spinner: SpinnerConfig, duration: number, index: number, total: number) {
  const data = spinner.fn(duration, index, total);
  data.style['animation-duration'] = `${duration}ms`;

  return (
    <svg viewBox="0 0 64 64" style={data.style}>
      <line transform="translate(32,32)" y1={data.y1} y2={data.y2}></line>
    </svg>
  );
}
