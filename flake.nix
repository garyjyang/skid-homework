# vim:fileencoding=utf-8:foldmethod=marker
#: Tip: If you are using (n)vim, you can press zM to fold all the config blocks quickly (za to fold under cursor)
#: Tip: search keywords to start quickly
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    blackbox.url = "github:cubewhy/blackbox-flakes";
  };

  outputs = {
    self,
    blackbox,
    nixpkgs,
    ...
  }: let
    overlays = [];
  in {
    devShells =
      blackbox.lib.eachSystem {
        inherit nixpkgs overlays;
      } (pkgs: {
        default = blackbox.lib.mkShell {
          inherit pkgs;

          #: Config {{{
          config = {
            #: Languages {{{

            #: Javascript/Typescript {{{
            #: tags: javascript, typescript, js, ts, nodejs, npm, pnpm, yarn
            blackbox.languages.javascript = {
              enable = true;
              #: Node.js package to use
              package = pkgs.nodejs-slim;
              #: manager: available values ["npm" "pnpm" "yarn"]
              manager = "pnpm";
              #: Auto run `npm install` (or with other package managers) if package.json exist
              autoInstall = true;
            };
            #: }}}

            #: Tools {{{
            blackbox.tools.pre-commit = {
              enable = false;
              #: Force run `pre-commit install` when enter shell
              #: This is not recommended, please don't enable it.
              runOnStart = false;
            };
            #: }}}
          };
          #: }}}

          #: mkShell builtin options are available
          # shellHook = ''
          # '';
        };
      });
  };
}
