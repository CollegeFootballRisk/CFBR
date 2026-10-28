/* SPDX-License-Identifier: MPL-2.0 */

export function getTeamLogo(logo: string): string {
  if (/^(https?:\/\/|\/)/i.test(logo)) {
    return logo;
  }

  return `/images/logos/${encodeURIComponent(logo).replace(/%26/gi, "&")}`;
}
