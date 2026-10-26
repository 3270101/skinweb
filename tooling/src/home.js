import * as gu from "react";
import { ui as f } from "./ui.js";
import { plans } from "./plans.js";
import { AddonCards, PricingSection, StoresSection, FaqSection, ExploreSection, ScalpMainCard, ScalpProcess, PlanTabs, ServiceIntroLink, SiteDirectory } from "./components.js";
import {MembershipCredit,MembershipPlans} from './membership-credit.js';
import {membership,membershipUsage,money} from './content.js';
import {ProcessGallery} from './process-gallery.js';
import {ValueGuide,KoreanBeauticianInfo} from './search-content.js';

export default function Home({initialPlan='SCALP'}) {
  const [M, ol] = gu.useState("home"),
    [k, g] = gu.useState(initialPlan),
    [B, K] = gu.useState(0),
    A = plans,
    _ = (Y) => {
      ol(Y);
      const al = document.getElementById(Y);
      al && al.scrollIntoView({ behavior: "smooth" });
    },
    cl = (Y) => {
      g(Y), K(0);
    },
    F = (Y) => {
      K(Y);
    },
    lineOA = () => {
      window.open("https://lin.ee/ANemNqJ", "_blank");
    },
    linkFB = () => {
      window.open(
        "https://www.facebook.com/people/%E8%82%8C%E5%AF%86%E5%AE%A3%E8%A8%80/61575704535521/",
        "_blank"
      );
    },
    P = A[k];
  return f.jsxs("div", {
    className: "min-h-screen bg-gray-50",
    children: [
      f.jsx("nav", {
        className: "fixed top-0 left-0 right-0 z-50 navbar",
        children: f.jsx("div", {
          className: "container mx-auto px-4 py-3",
          children: f.jsxs("div", {
            className: "flex items-center justify-between",
            children: [
              f.jsxs("div", {
                className: "flex items-center space-x-2",
                children: [
                  f.jsx("img", {
                    src: "LOGO4.jpg",
                    alt: "肌密宣言",
                    className: "w-10 h-10 rounded-full",
                  }),
                  f.jsx("span", {
                    className: "text-xl font-bold text-brand-primary",
                    children: "肌密宣言",
                  }),
                ],
              }),
              f.jsx("div", {
                className: "skin-home-links",
                children: [
                  { id: "home", label: "關於我們" },
                  { id: "services", label: "服務項目" },
                  { id: "scalp-care", label: "洗髮方案" },
                  { id: "process", label: "服務流程" },
                  { id: "pricing", label: "價目表" },
                  { id: "contact", label: "門市預約" },
                ].map((Y) =>
                  f.jsx(
                    "a",
                    {
                      href: `#${Y.id}`,
                      onClick: () => ol(Y.id),
                      className: `px-4 py-2 rounded-lg transition-all duration-200 ${
                        M === Y.id
                          ? "bg-brand-primary text-white"
                          : "text-gray-700 hover:bg-brand-light-teal hover:text-brand-primary"
                      }`,
                      children: Y.label,
                    },
                    Y.id
                  )
                ),
              }),
              f.jsx("button", {
                onClick: () => lineOA(),
                className:
                  "bg-brand-primary text-white px-6 py-2 rounded-full hover:bg-brand-secondary transition-colors",
                children: "立即預約 ✨",
              }),
            ],
          }),
        }),
      }),
      f.jsx("section", {
        id: "home",
        className: "pt-20 pb-16 bg-gradient-to-br from-blue-50 to-cyan-50",
        children: f.jsx("div", {
          className: "container mx-auto px-4 text-center",
          children: f.jsxs("div", {
            className: "mb-8",
            children: [
              f.jsx("img", {
                src: "LOGO3.jpg",
                alt: "肌密宣言 LOGO",
                className: "w-32 h-32 mx-auto rounded-full shadow-lg mb-6",
              }),
              f.jsx("h1", {
                className: "text-5xl font-bold text-brand-primary mb-4",
                children: "肌密宣言 SKINOW｜洗臉護膚・台中夜間洗髮",
              }),
              f.jsx("p", {
                className: "text-3xl font-light text-brand-secondary mb-4",
                children: "洗頭、洗臉，服務與價格一次看清楚。",
              }),
              f.jsx("p", {
                className: "text-xl text-gray-600 mb-8",
                children: "台中忠明店深層洗髮 50 分鐘，會員價 NT$500；A 方案洗臉 40 分鐘、15 步驟，會員價 NT$550，另有 EXOSOME 外泌體做臉。公開每項價格與流程，把 CP 值花在看得見的服務。營業至 22:30，韓國籍持照美容師駐店；新客可免費領取 30 天會員價，指定美容師與夜間時段請先確認。",
              }),
              f.jsx("a", {
                href: "#pricing",
                className:
                  "bg-brand-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-brand-secondary transition-all duration-300 transform hover:scale-105 shadow-lg",
                children: "快速了解服務一覽表",
              }),
            ],
          }),
        }),
      }),
      f.jsx("div", {className:"skin-credit-home",children:f.jsx(MembershipCredit,{})}),
      f.jsx("div", {className:"skin-credit-home",children:f.jsx(ValueGuide,{})}),
      f.jsx("div", {className:"skin-credit-home",children:f.jsx(KoreanBeauticianInfo,{})}),
      f.jsx(PricingSection, {}),
      f.jsx("section", {
        id: "services",
        className: "py-16 bg-gray-50",
        children: f.jsxs("div", {
          className: "container mx-auto px-4",
          children: [
            f.jsx("h2", {
              className:
                "text-4xl font-bold text-center text-brand-primary mb-4",
              children: "服務項目",
            }),
            f.jsx("p", {
              className: "text-center text-gray-600 mb-12",
              children: "選擇適合您的洗髮或護膚方案",
            }),
            f.jsxs("div", {
              className: "skin-main-services grid gap-6",
              children: [
                f.jsx(ScalpMainCard, {}),
                f.jsxs("div", {
                  className:
                    "bg-white rounded-xl shadow-lg overflow-hidden card-hover",
                  children: [
                    f.jsxs("div", {
                      className: "bg-brand-primary text-white p-4 text-center",
                      children: [
                        f.jsxs("div", {
                          className: "text-sm opacity-90 mb-1",
                          children: [A.A.steps, "步驟"],
                        }),
                        f.jsxs("div", {
                          className:
                            "flex items-center justify-center space-x-4",
                          children: [
                            f.jsx("h3", {
                              className: "text-2xl font-bold",
                              children: A.A.name,
                            }),
                            f.jsx("span", {
                              className: "text-sm opacity-75",
                              children: A.A.duration,
                            }),
                          ],
                        }),
                      ],
                    }),
                    f.jsxs("div", {
                      className: "p-6",
                      children: [
                        f.jsx("h4", {
                          className: "text-xl font-semibold text-gray-800 mb-3",
                          children: A.A.title,
                        }),
                        f.jsx("p", {
                          className: "text-gray-600 text-sm mb-4",
                          children:
                            "針對粉刺、痘痘肌膚，注重於肌膚深層清潔、無痛粉刺痘痘導出與老廢角質清除。",
                        }),
                        f.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            f.jsxs("div", {
                              className: "text-sm text-gray-500",
                              children: ["原價 ", A.A.originalPrice],
                            }),
                            f.jsxs("div", {
                              className: "text-xl font-bold text-brand-primary",
                              children: ["會員價 ", A.A.memberPrice],
                            }),
                          ],
                        }),
                        f.jsx(ServiceIntroLink, {planKey:"A"}),
                      ],
                    }),
                  ],
                }),
                f.jsxs("div", {
                  className:
                    "bg-white rounded-xl shadow-lg overflow-hidden card-hover",
                  children: [
                    f.jsxs("div", {
                      className: "bg-orange-500 text-white p-4 text-center",
                      children: [
                        f.jsxs("div", {
                          className: "text-sm opacity-90 mb-1",
                          children: [A.B.steps, "步驟"],
                        }),
                        f.jsxs("div", {
                          className:
                            "flex items-center justify-center space-x-4",
                          children: [
                            f.jsx("h3", {
                              className: "text-2xl font-bold",
                              children: A.B.name,
                            }),
                            f.jsx("span", {
                              className: "text-sm opacity-75",
                              children: A.B.duration,
                            }),
                          ],
                        }),
                      ],
                    }),
                    f.jsxs("div", {
                      className: "p-6",
                      children: [
                        f.jsx("h4", {
                          className: "text-xl font-semibold text-gray-800 mb-3",
                          children: A.B.title,
                        }),
                        f.jsx("p", {
                          className: "text-gray-600 text-sm mb-4",
                          children:
                            "適合想提亮膚色的客群，利用高光波柔嫩肌膚、提亮光澤。",
                        }),
                        f.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            f.jsxs("div", {
                              className: "text-sm text-gray-500",
                              children: ["原價 ", A.B.originalPrice],
                            }),
                            f.jsxs("div", {
                              className: "text-xl font-bold text-orange-500",
                              children: ["會員價 ", A.B.memberPrice],
                            }),
                          ],
                        }),
                        f.jsx(ServiceIntroLink, {planKey:"B"}),
                      ],
                    }),
                  ],
                }),
                f.jsxs("div", {
                  className:
                    "bg-white rounded-xl shadow-lg overflow-hidden card-hover",
                  children: [
                    f.jsxs("div", {
                      className: "bg-green-500 text-white p-4 text-center",
                      children: [
                        f.jsxs("div", {
                          className: "text-sm opacity-90 mb-1",
                          children: [A.C.steps, "步驟"],
                        }),
                        f.jsxs("div", {
                          className:
                            "flex items-center justify-center space-x-4",
                          children: [
                            f.jsx("h3", {
                              className: "text-2xl font-bold",
                              children: A.C.name,
                            }),
                            f.jsx("span", {
                              className: "text-sm opacity-75",
                              children: A.C.duration,
                            }),
                          ],
                        }),
                      ],
                    }),
                    f.jsxs("div", {
                      className: "p-6",
                      children: [
                        f.jsx("h4", {
                          className: "text-xl font-semibold text-gray-800 mb-3",
                          children: A.C.title,
                        }),
                        f.jsx("p", {
                          className: "text-gray-600 text-sm mb-4",
                          children:
                            "提拉收緊肌膚，同時強化肌膚保濕度。",
                        }),
                        f.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            f.jsxs("div", {
                              className: "text-sm text-gray-500",
                              children: ["原價 ", A.C.originalPrice],
                            }),
                            f.jsxs("div", {
                              className: "text-xl font-bold text-green-500",
                              children: ["會員價 ", A.C.memberPrice],
                            }),
                          ],
                        }),
                        f.jsx(ServiceIntroLink, {planKey:"C"}),
                      ],
                    }),
                  ],
                }),
                f.jsxs("div", {
                  className:
                    "bg-white rounded-xl shadow-lg overflow-hidden card-hover relative",
                  children: [
                    f.jsx("div", {
                      className:
                        "absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full",
                      children: "熱門推薦",
                    }),
                    f.jsxs("div", {
                      className: "bg-red-500 text-white p-4 text-center",
                      children: [
                        f.jsxs("div", {
                          className: "text-sm opacity-90 mb-1",
                          children: [A.EXOSOME.steps, "步驟"],
                        }),
                        f.jsxs("div", {
                          className:
                            "flex items-center justify-center space-x-4",
                          children: [
                            f.jsx("h3", {
                              className: "text-2xl font-bold",
                              children: A.EXOSOME.name,
                            }),
                            f.jsx("span", {
                              className: "text-sm opacity-75",
                              children: A.EXOSOME.duration,
                            }),
                          ],
                        }),
                      ],
                    }),
                    f.jsxs("div", {
                      className: "p-6",
                      children: [
                        f.jsx("h4", {
                          className: "text-xl font-semibold text-gray-800 mb-3",
                          children: A.EXOSOME.title,
                        }),
                        f.jsx("p", {
                          className: "text-gray-600 text-sm mb-4",
                          children:
                            A.EXOSOME.description,
                        }),
                        f.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            f.jsxs("div", {
                              className: "text-sm text-gray-500",
                              children: ["原價 ", A.EXOSOME.originalPrice],
                            }),
                            f.jsxs("div", {
                              className: "text-xl font-bold text-red-500",
                              children: ["會員價 ", A.EXOSOME.memberPrice],
                            }),
                          ],
                        }),
                        f.jsx(ServiceIntroLink, {planKey:"EXOSOME"}),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            f.jsx(AddonCards, {}),
          ],
        }),
      }),
      k === 'SCALP' ? f.jsx(ScalpProcess, {}) : f.jsx("section", {
        id: "process",
        className: "py-16 bg-white",
        children: f.jsxs("div", {
          className: "container mx-auto px-4",
          children: [
            f.jsx("h2", {
              className:
                "text-4xl font-bold text-center text-brand-primary mb-4",
              children: "詳細服務流程",
            }),
            f.jsx("p", {
              className: "text-center text-gray-600 mb-12",
              children: "選擇方案，查看流程影片或逐步圖解",
            }),
            f.jsx(PlanTabs, {selected:k}),
            f.jsx("div", {
              className: "max-w-4xl mx-auto mb-12",
              children: f.jsxs("div", {
                className: "bg-gray-50 rounded-xl p-8",
                children: [
                  f.jsxs("h3", {
                    className: "text-2xl font-bold text-brand-primary mb-4",
                    children: [P.name, " - ", P.title],
                  }),
                  f.jsx("p", {
                    className: "text-gray-700 mb-6",
                    children: P.description,
                  }),
                  f.jsxs("div", {
                    className: "flex flex-wrap gap-4 text-sm",
                    children: [
                      f.jsxs("span", {
                        className: "flex items-center gap-2",
                        children: [
                          f.jsx("span", {
                            className: "text-blue-500",
                            children: "⏱️",
                          }),
                          " ",
                          P.duration,
                        ],
                      }),
                      f.jsxs("span", {
                        className: "flex items-center gap-2",
                        children: [
                          f.jsx("span", {
                            className: "text-green-500",
                            children: "💰",
                          }),
                          " 會員價 ",
                          P.memberPrice,
                        ],
                      }),
                      f.jsxs("span", {
                        className: "flex items-center gap-2",
                        children: [
                          f.jsx("span", {
                            className: "text-purple-500",
                            children: "📋",
                          }),
                          " ",
                          P.steps,
                          "個專業步驟",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
            f.jsx(ProcessGallery, {plan:P}),
          ],
        }),
      }),
      f.jsx("section", {
        id: "membership",
        className: "py-16 bg-white",
        children: f.jsxs("div", {
          className: "container mx-auto px-4",
          children: [
            f.jsx("h2", {
              className:
                "text-4xl font-bold text-center text-brand-primary mb-12",
              children: "美麗保養金與會員權益",
            }),
            f.jsxs("div", {
              className: "max-w-4xl mx-auto",
              children: [
                f.jsx(MembershipPlans, {}),
                f.jsx("p", {className:"skin-note",children:membershipUsage+"品牌好禮可選品項請洽門市。"}),
                f.jsxs("div", {
                  className: "bg-gray-50 rounded-xl p-8",
                  children: [
                    f.jsx("h3", {
                      className: "text-2xl font-bold text-brand-primary mb-6",
                      children: "肌密宣言會員規章",
                    }),
                    f.jsxs("div", {
                      className: "space-y-6",
                      children: [
                        f.jsxs("div", {
                          children: [
                            f.jsx("h4", {
                              className:
                                "text-lg font-semibold text-gray-800 mb-3",
                              children: "會員資格",
                            }),
                            f.jsxs("ul", {
                              className: "space-y-2 text-gray-700",
                              children: [
                                f.jsx("li", {
                                  children:
                                    "• 此會員僅限用於肌密宣言  特約商店（直營、加盟）使用(基於會員資格所購買之商品券，商品券得使用之店家依各店面公告定之)",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 凡年滿十八歲且經由肌密宣言審核通過者，均可申請專屬會員卡",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 會員卡只限申請者本人消費使用，不得轉借或轉讓給其他任何人",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 結帳時，必須出示有效會員卡，方可享有會員價",
                                }),
                              ],
                            }),
                          ],
                        }),
                        f.jsxs("div", {
                          children: [
                            f.jsx("h4", {
                              className:
                                "text-lg font-semibold text-gray-800 mb-3",
                              children: "美麗保養金禮遇與保養額度",
                            }),
                            f.jsxs("ul", {
                              className: "space-y-2 text-gray-700",
                              children: [
                                ...membership.plans.map(plan=>f.jsx("li", {children:`• 購買 ${money(plan.price)} 美麗保養金，獲得 ${money(plan.credit)} 保養額度${plan.gift?'；品牌好禮任選一':''}。`},plan.slug)),
                                f.jsx("li", {children:`• 三種美麗保養金效期皆為 ${membership.months} 個月，享會員價；保養額度可分次抵扣服務，差額另付。`}),
                                f.jsx("li", {
                                  children:
                                    "• 會員卡經售出概不退費，且不得轉讓第三者",
                                }),
                              ],
                            }),
                          ],
                        }),
                        f.jsxs("div", {
                          children: [
                            f.jsx("h4", {
                              className:
                                "text-lg font-semibold text-gray-800 mb-3",
                              children: "會員卡有效期限及續約",
                            }),
                            f.jsxs("ul", {
                              className: "space-y-2 text-gray-700",
                              children: [
                                f.jsx("li", {
                                  children:
                                    "• 於會員卡到期後2個月內續約，效期自原到期日起算",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 於會員卡到期後2個月以後續約，效期自續約日起算",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 會員到期前1個月將透過官方LINE發送提醒通知",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 續約作業限會員本人親自門市進行辦理",
                                }),
                              ],
                            }),
                          ],
                        }),
                        f.jsxs("div", {
                          children: [
                            f.jsx("h4", {
                              className:
                                "text-lg font-semibold text-gray-800 mb-3",
                              children: "其他注意事項",
                            }),
                            f.jsxs("ul", {
                              className: "space-y-2 text-gray-700",
                              children: [
                                f.jsx("li", {
                                  children:
                                    "• 會員必須遵守所有肌密宣言會員規章與條款",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 肌密宣言得隨時視情況修訂或更改會員規章與條款",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 若會員不慎遺失會員卡，請至櫃檯告知服務人員進行補發",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    f.jsxs("div", {
                      className: "mt-8 bg-white rounded-xl shadow-lg p-8",
                      children: [
                        f.jsx("h3", {
                          className:
                            "text-xl font-semibold text-brand-primary mb-6",
                          children: "消費須知與會員權益",
                        }),
                        f.jsxs("div", {
                          className:
                            "grid md:grid-cols-2 gap-6 text-sm text-gray-700",
                          children: [
                            f.jsxs("ul", {
                              className: "space-y-2",
                              children: [
                                f.jsx("li", {
                                  children: "• 一般會員消費皆為原價。",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 方案加購項目需搭配方案才可使用，無法單獨購買。",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 美麗保養金提供 NT$999、NT$2,999、NT$4,999 三種加值禮遇，分別獲得 NT$1,200、NT$3,600、NT$6,500 保養額度，效期皆為 12 個月，享會員價。",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 結帳時請出示會員卡核對會員身分。",
                                }),
                              ],
                            }),
                            f.jsxs("ul", {
                              className: "space-y-2",
                              children: [
                                f.jsx("li", {
                                  children:
                                    "• 會員卡經使用概不退費，且不得轉讓第三者。",
                                }),
                                f.jsx("li", {
                                  children:
                                    "• 詳細會員制度請洽詢櫃台服務人員。",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
      f.jsx(StoresSection, {}),
      f.jsx(FaqSection, {}),
      f.jsx(ExploreSection, {}),
      f.jsx("footer", {
        className: "bg-brand-primary text-white py-12",
        children: f.jsxs("div", {
          className: "container mx-auto px-4 text-center",
          children: [
            f.jsx(SiteDirectory, {}),
            f.jsxs("div", {
              className: "mb-6",
              children: [
                f.jsx("img", {
                  src: "LOGO4.jpg",
                  alt: "肌密宣言",
                  className: "w-16 h-16 mx-auto rounded-full mb-4",
                }),
                f.jsx("h3", {
                  className: "text-2xl font-bold mb-2",
                  children: "肌密宣言",
                }),
                f.jsx("p", {
                  className: "text-brand-light-teal",
                  children: "CLEAN FACE. CLEAR MIND.",
                }),
                f.jsx("p", {
                  className: "text-sm opacity-90 mt-2",
                  children: "Every Face Has A Story. We Make It Shine.",
                }),
              ],
            }),
            f.jsx("div", {
              className: "border-t border-brand-secondary pt-6",
              children: f.jsx("p", {
                className: "text-sm opacity-75",
                children:
                  "© 2026 肌密宣言 SKINOW. All rights reserved. | 服務內容與適用情況請於預約時向門市確認。",
              }),
            }),
          ],
        }),
      }),
    ],
  });
}
