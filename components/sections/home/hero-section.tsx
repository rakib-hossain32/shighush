"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SearchDialog } from "./hero-dialogs/search-dialog";
import { DetailDialog } from "./hero-dialogs/detail-dialog";
import { InfoDialog, type ExhibitData } from "./hero-dialogs/info-dialog";

export default function HeroSection() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeRecordId, setActiveRecordId] = useState<string | null>("SG-2026-0042");
  const [evidenceFocus, setEvidenceFocus] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoKey, setInfoKey] = useState<string | number | null>(null);
  const [exhibitData, setExhibitData] = useState<ExhibitData | null>(null);

  const handleOpenInfo = (key: string | number) => {
    setExhibitData(null);
    setInfoKey(key);
    setInfoOpen(true);
  };

  const handleOpenRecord = (recordId: string, focusEvidence = false) => {
    setActiveRecordId(recordId);
    setEvidenceFocus(focusEvidence);
    setDetailOpen(true);
  };

  return (
    <section className="relative isolate overflow-clip" aria-labelledby="hero-heading">
      {/* Background grid texture */}
      <div
        className="pointer-events-none absolute top-0 right-0 bottom-[60px] w-full max-lg:top-[49%] lg:w-[53%] -z-10 bg-[size:42px_42px] [background-image:linear-gradient(var(--grid)_1px,transparent_1px),linear-gradient(90deg,var(--grid)_1px,transparent_1px)] [mask-image:linear-gradient(180deg,transparent,var(--ink)_15%,var(--ink))] lg:[mask-image:linear-gradient(90deg,transparent,var(--ink)_22%,var(--ink))]"
        aria-hidden="true"
      />
      
      <div className="page-width grid grid-cols-1 lg:grid-cols-[1.04fr_1fr] items-center gap-8 max-w-[650px] lg:max-w-none pt-9 pb-7 sm:pt-12 sm:pb-11">
        {/* Left Column: Hero copy and actions */}
        <div className="relative z-10 max-w-[620px] pb-1">
          <p className="reveal flex items-center gap-2.5 text-[10px] sm:text-xs font-semibold tracking-wider text-foreground">
            <span className="relative inline-block size-3 shrink-0 text-primary" aria-hidden="true">
              <span className="absolute left-0 top-[5px] h-[3px] w-full bg-current" />
              <span className="absolute left-[5px] top-0 h-full w-[3px] bg-current" />
            </span>
            নাগরিক কণ্ঠ • তথ্য • জবাবদিহিতা
          </p>

          <h1 id="hero-heading" className="reveal delay-1 mt-5 sm:mt-6 text-[clamp(49px,12.8vw,73px)] lg:text-[clamp(62px,5.86vw,86px)] font-bold leading-[1.16] tracking-[-0.035em] text-foreground">
            <span className="block">অভিযোগ চাপা</span>
            <span className="block">পড়ে থাকতে</span>
            <span className="block">
              <span className="relative inline-block text-primary pb-1">
                হবে না।
                <svg
                  className="absolute left-0 -bottom-1 h-2.5 sm:h-3.5 w-[101%] overflow-visible text-primary"
                  viewBox="0 0 280 14"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C69 1 173 1 278 6M36 12c74-6 155-6 218-3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          <p className="reveal delay-2 mt-6 sm:mt-7 text-lg sm:text-xl lg:text-[21px] font-semibold leading-relaxed tracking-tight text-foreground">
            জানান। নথিবদ্ধ করুন। অনুসরণ করুন।
          </p>

          <p className="reveal delay-2 mt-2.5 sm:mt-3 max-w-[445px] text-sm sm:text-base leading-[1.85] text-muted-foreground">
            ঘুষ, হয়রানি কিংবা সেবা থেকে বঞ্চনা। পরিচয় গোপন রেখে অভিযোগ জানান,
            প্রমাণ যুক্ত করুন, আর যাচাই থেকে প্রকাশ পর্যন্ত প্রতিটি ধাপের
            অগ্রগতি জানুন।
          </p>

          <div className="reveal delay-3 mt-6 sm:mt-7 flex flex-wrap items-center gap-5 sm:gap-7">
            <Link
              href="/report/new"
              className="group hero-cta"
              data-action="report"
            >
              অভিযোগ জানান
              <svg className="icon size-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
                <use href="#i-arrow-up-right" />
              </svg>
            </Link>

            <button
              className="hero-search"
              type="button"
              data-action="search"
              onClick={() => setSearchOpen(true)}
            >
              রিপোর্ট খুঁজুন
              <svg className="icon size-4 text-foreground" aria-hidden="true">
                <use href="#i-search" />
              </svg>
            </button>
          </div>

          <p className="reveal delay-4 mt-4 sm:mt-5 flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
            <svg className="icon size-4 fill-accent text-[var(--ink)] shrink-0" aria-hidden="true">
              <use href="#i-shield" />
            </svg>
            পরিচয় প্রকাশ বাধ্যতামূলক নয়
          </p>
        </div>

        <figure
          className="evidence-board reveal delay-2"
          aria-label="Civic Evidence Board: একটি নমুনা অভিযোগ, সংযুক্ত প্রমাণ, যাচাই ও পরিচয় সুরক্ষার ইন্টারঅ্যাকটিভ নথি"
        >
          <figcaption className="sr-only">
            নমুনা নথিগুলোতে ক্লিক করে রিপোর্ট, প্রমাণ এবং যাচাই প্রক্রিয়া
            সম্পর্কে জানুন।
          </figcaption>
          <div className="board-canvas">
            <div className="board-topline">
              <span className="mono" lang="en">
                THE CIVIC EVIDENCE BOARD
              </span>
              <span className="flex items-center gap-[0.65em] font-sans text-[1.22em] tracking-[0.02em]">
                <i className="inline-block w-[0.45em] h-[0.45em] rounded-full bg-primary" aria-hidden="true"></i>
                নমুনা নথি
              </span>
            </div>
            <div className="board-watermark" lang="en" aria-hidden="true">
              shighush
            </div>
            <svg
              className="connector-lines"
              viewBox="0 0 560 618"
              aria-hidden="true"
            >
              <path
                className="connector"
                d="M100 250H30V493H125M454 129h60v213M351 481v56h86"
              />
              <circle className="connector-node" cx="30" cy="250" r="3" />
              <circle className="connector-node" cx="514" cy="187" r="3" />
              <circle className="connector-node" cx="351" cy="537" r="3" />
              <path
                d="M482 503c-7 12-14 15-29 16m0 0 8-7m-8 7 10 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity=".5"
              />
            </svg>
            <span
              className="registration-mark registration-one"
              aria-hidden="true"
            ></span>
            <span
              className="registration-mark registration-two"
              aria-hidden="true"
            ></span>
            <div className="folder-backing" aria-hidden="true">
              <span className="folder-tab mono">PUBLIC RECORD / 042</span>
            </div>

            <div className="report-wrap">
              <button
                className="report-sheet"
                type="button"
                data-record="SG-2026-0042"
                onClick={() => handleOpenRecord("SG-2026-0042")}
                aria-label="নমুনা রিপোর্ট ০০৪২ দেখুন: সেবা পেতে অতিরিক্ত অর্থ দাবি"
              >
                <span className="paper-clip" aria-hidden="true"></span>
                <span className="record-header">
                  <span className="record-brand" lang="en">
                    shighush<b className="text-primary font-bold">.</b>
                  </span>
                  <span className="record-header-code mono" lang="en">
                    CITIZEN RECORD
                    <br />
                    SG-2026-0042
                  </span>
                </span>
                <span className="record-kicker">
                  <svg className="icon" aria-hidden="true">
                    <use href="#i-file" />
                  </svg>
                  একটি রিপোর্ট / ০০৪২
                </span>
                <span className="record-title">
                  সেবা পেতে
                  <br />
                  অতিরিক্ত অর্থ দাবি
                </span>
                <span className="record-meta">
                  ভূমি সেবা · শিবচর, মাদারীপুর
                </span>
                <span className="redacted-copy" aria-hidden="true">
                  <span className="redacted-label">
                    ঘটনার বিবরণ / সংবেদনশীল তথ্য গোপন
                  </span>
                  <span className="redacted-line">
                    <i className="redact" style={{ width: "37%" }}></i>
                    <i className="redact soft" style={{ width: "44%" }}></i>
                  </span>
                  <span className="redacted-line">
                    <i className="redact soft" style={{ width: "21%" }}></i>
                    <i className="redact" style={{ width: "56%" }}></i>
                  </span>
                  <span className="redacted-line">
                    <i className="redact" style={{ width: "48%" }}></i>
                    <i className="redact medium" style={{ width: "17%" }}></i>
                  </span>
                  <span className="redacted-line">
                    <i className="redact medium" style={{ width: "29%" }}></i>
                    <i className="redact soft" style={{ width: "53%" }}></i>
                  </span>
                </span>
                <span className="verified-stamp" aria-hidden="true">
                  <strong className="block font-manrope text-[1.37em] font-extrabold tracking-[0.09em]" lang="en">
                    VERIFIED
                  </strong>
                  <small className="mono block mt-[0.4em] text-foreground text-[0.4em] tracking-[0.18em] text-center" lang="en">
                    SAMPLE / EVIDENCE REVIEWED
                  </small>
                </span>
                <span className="record-bottom">
                  <span className="flex items-center gap-[0.5em]">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-lock" />
                    </svg>
                    পরিচয় গোপন
                  </span>
                  <span className="mono flex items-center gap-[0.5em]">১৮.০২.২০২৬ · ১০:৪২</span>
                </span>
              </button>
            </div>

            <button
              className="privacy-slip"
              type="button"
              data-info="privacy"
              onClick={() => handleOpenInfo("privacy")}
              aria-label="পরিচয় সুরক্ষা সম্পর্কে জানুন"
            >
              <svg className="icon" aria-hidden="true">
                <use href="#i-shield" />
              </svg>
              <span>
                <span className="slip-title">পরিচয় সুরক্ষিত</span>
                <small className="block text-[0.52em] mt-[0.7em] opacity-75">
                  নাম নয়, তথ্যই গুরুত্বপূর্ণ
                </small>
              </span>
            </button>

            <div className="attachment-wrap">
              <button
                className="attachment-slip"
                type="button"
                data-evidence="SG-2026-0042"
                onClick={() => handleOpenRecord("SG-2026-0042", true)}
                aria-label="নমুনা রিপোর্টের দুটি সংযুক্ত প্রমাণ দেখুন"
              >
                <span className="attachment-top">
                  <span>প্রমাণ সংযুক্ত</span>
                  <svg className="icon" aria-hidden="true">
                    <use href="#i-clip" />
                  </svg>
                </span>
                <span className="attachment-content">
                  <span className="mini-documents" aria-hidden="true">
                    <span className="mini-document">
                      <i className="block h-px bg-foreground mb-[0.3em] opacity-55"></i>
                      <i className="block h-px bg-foreground mb-[0.3em] opacity-55"></i>
                      <i className="block h-px bg-foreground mb-[0.3em] opacity-55 w-[65%]"></i>
                    </span>
                    <span className="mini-document">
                      <i className="block h-px bg-foreground mb-[0.3em] opacity-55"></i>
                      <i className="block h-px bg-foreground mb-[0.3em] opacity-55"></i>
                      <i className="block h-px bg-foreground mb-[0.3em] opacity-55 w-[65%]"></i>
                    </span>
                  </span>
                  <span className="attachment-file-label">
                    নথি_০১.pdf
                    <small className="block text-[0.85em] text-muted-foreground">রসিদ_০২.jpg</small>
                    <small className="block text-[0.85em] text-muted-foreground">২টি ফাইল সংযুক্ত</small>
                  </span>
                </span>
                <span className="attachment-footer mono" lang="en">
                  EXHIBIT A + B / DOCUMENTED
                </span>
              </button>
            </div>

            <button
              className="verification-slip"
              type="button"
              data-step="3"
              onClick={() => handleOpenInfo(3)}
              aria-label="যাচাই স্তর: প্রমাণ যাচাই প্রক্রিয়া সম্পর্কে জানুন"
            >
              <span className="verification-icon">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-check" />
                </svg>
              </span>
              <span className="verification-content">
                <span className="verification-kicker mono" lang="en">
                  EVIDENCE VERIFICATION
                </span>
                <span className="slip-title">যাচাই স্তর</span>
                <span className="verification-track" aria-hidden="true">
                  <i className="block w-[2.1em] h-[0.19em] bg-[var(--ink)]"></i>
                  <i className="block w-[2.1em] h-[0.19em] bg-[var(--ink)]"></i>
                  <i className="block w-[2.1em] h-[0.19em] bg-[var(--ink)] opacity-55"></i>
                </span>
              </span>
              <span className="verification-level">০৩ / ০৩</span>
            </button>
            <span className="handwritten-note" aria-hidden="true">
              পরিচয় নয়,
              <br />
              তথ্যই সামনে।
            </span>
            <span
              className="board-side-label mono"
              aria-hidden="true"
              lang="en"
            >
              A VOICE BECOMES A RECORD.
            </span>

            <ol
              className="absolute left-[2%] sm:left-[7%] right-0 bottom-0 sm:bottom-[0.1%] flex items-center justify-between border-t border-border pt-1.5 sm:pt-2.5"
              aria-label="একটি অভিযোগের পাঁচটি ধাপ"
            >
              <li className="flex items-center justify-center gap-1 sm:gap-1.5">
                <button
                  className="wf-step"
                  type="button"
                  data-step="0"
                  onClick={() => handleOpenInfo(0)}
                >
                  <i className="inline-block size-1 bg-foreground rounded-full" aria-hidden="true" />
                  অভিযোগ
                </button>
                <svg className="icon size-2.5 sm:size-3.5 opacity-45" aria-hidden="true">
                  <use href="#i-arrow-right" />
                </svg>
              </li>
              <li className="flex items-center justify-center gap-1 sm:gap-1.5">
                <button
                  className="wf-step"
                  type="button"
                  data-step="1"
                  onClick={() => handleOpenInfo(1)}
                >
                  মডারেশন
                </button>
                <svg className="icon size-2.5 sm:size-3.5 opacity-45" aria-hidden="true">
                  <use href="#i-arrow-right" />
                </svg>
              </li>
              <li className="flex items-center justify-center gap-1 sm:gap-1.5">
                <button
                  className="wf-step"
                  type="button"
                  data-step="2"
                  onClick={() => handleOpenInfo(2)}
                >
                  প্রমাণ
                </button>
                <svg className="icon size-2.5 sm:size-3.5 opacity-45" aria-hidden="true">
                  <use href="#i-arrow-right" />
                </svg>
              </li>
              <li className="flex items-center justify-center gap-1 sm:gap-1.5">
                <button
                  className="wf-step"
                  type="button"
                  data-step="3"
                  onClick={() => handleOpenInfo(3)}
                >
                  <i className="inline-block size-1.5 bg-accent border border-foreground rounded-full" aria-hidden="true" />
                  যাচাই
                </button>
                <svg className="icon size-2.5 sm:size-3.5 opacity-45" aria-hidden="true">
                  <use href="#i-arrow-right" />
                </svg>
              </li>
              <li className="flex items-center justify-center gap-1 sm:gap-1.5">
                <button
                  className="wf-step"
                  type="button"
                  data-step="4"
                  onClick={() => handleOpenInfo(4)}
                >
                  প্রকাশ
                </button>
              </li>
            </ol>
          </div>
        </figure>
      </div>
      <div className="page-width border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 min-h-[66px] sm:min-h-[77px] py-4">
        <Link
          className="group inline-flex items-center gap-3 text-xs sm:text-[13px] font-medium text-foreground transition-colors hover:text-primary"
          href="#how-it-works"
        >
          <svg
            className="icon size-4 text-foreground transition-transform duration-200 group-hover:translate-y-1"
            aria-hidden="true"
          >
            <use href="#i-arrow-down" />
          </svg>
          একটি অভিযোগ যেভাবে নথি হয়ে ওঠে
        </Link>
        <p className="text-[10px] sm:text-[11px] text-muted-foreground text-left sm:text-right">
          প্রকাশিত তথ্য নাগরিক-প্রতিবেদন; চূড়ান্ত আইনি সিদ্ধান্ত নয়।
        </p>
      </div>

      {/* Hero Interactive Dialogs */}
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onRecordClick={(recordId) => {
          setActiveRecordId(recordId);
          setEvidenceFocus(false);
          setSearchOpen(false);
          setDetailOpen(true);
        }}
      />

      <DetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        recordId={activeRecordId}
        evidenceFocus={evidenceFocus}
        onBackToSearch={() => {
          setDetailOpen(false);
          setSearchOpen(true);
        }}
        onOpenExhibit={(record, fileName, kind) => {
          setDetailOpen(false);
          setExhibitData({ recordId: record.id, fileName, kind });
          setInfoOpen(true);
        }}
      />

      <InfoDialog
        open={infoOpen}
        onOpenChange={(open) => {
          setInfoOpen(open);
          if (!open) {
            setExhibitData(null);
            setInfoKey(null);
          }
        }}
        infoKey={infoKey}
        exhibitData={exhibitData}
        onBackToRecord={() => {
          setInfoOpen(false);
          setEvidenceFocus(true);
          setDetailOpen(true);
        }}
      />
    </section>
  );
}