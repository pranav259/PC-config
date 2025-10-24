return {
  --themes that are downloaded
  --
  --
  --
  {
    "sainnhe/sonokai",
    lazy = false,
    priority = 1001,
    config = function()
      -- Optionally configure and load the colorscheme
      -- directly inside the plugin declaration.
      vim.g.sonokai_enable_italic = true
    end,
  },
  {
    "scottmckendry/cyberdream.nvim",
    lazy = false,
    priority = 1000,
  },
  { "rose-pine/neovim" },
  --set theme below
  --
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "cyberdream",
    },
  },
}
