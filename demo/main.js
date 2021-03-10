const TinyMDE = window.TinyMDE.default;
const TinyMDEInstance = new TinyMDE("#root", {
    toggleToolbar: false,
});

TinyMDEInstance.setContent(`# Backward-compatibility over performance in C++

Most programmers use C++ for its promise of performance above all, but in the last decade, performance has been deprioritized, and the consequences can prove detrimental to the future of the language.

- List entry 1
- List entry 2
- List entry 3

The current implementation of the standard associative containers is outdated. Since they were added to the library in C++11 a lot of research has been done on hashing techniques. Some 3rd-party implementations boast performance improvements of 200%-300% on average! Unfortunately, we are not expecting to see these improvements in the standard library anytime soon.

The suboptimal performance o8f these containers is an extreme case but other library and language facilities can be substantially improved (an estimated 5%-10% improvement to the performance of the language overall). So why do we keep adding new features to the language without addressing bottlenecks first?

Changing existing features isn’t easy because in most cases it results in an ABI break. The ABI (Application Binary Interface) is a protocol that determines the binary layout of an application. Updating the language may change this layout and cause alignment issues between pre-compiled libraries and working source-code.

This is not an issue for programmers who compile their dependencies from source but it’s not always possible. Some large companies depend on proprietary pre-compiled libraries and have no access to their source code. An ABI break will prevent their software from compiling, and in the last decade, the highest priority of the committee is making sure it never happens at the cost of runtime performance.

It’s hard to estimate the impact of an ABI break over our ecosystem but in a recent paper addressing this issue<sup>1</sup>, Senior Staff Engineer at Google Titus Winters, who was chair of the subcommittee for the design of the standard library wrote:

> “Google Server’s ecosystem builds nearly everything from source, has few external dependencies, and has better-than-average ability to undertake large refactoring tasks. Even for us, a recent ABI-breaking standard library change cost 5-10 engineer-years.”

A substantial ABI break will result in serious damage to the ecosystem but as staggering as this estimate is, choosing backward compatibility over performance can be even worse. Another paper submitted to the standards committee by several leading members from organizations such as Google and Nvidia<sup>2</sup> states:

> “Our experience is that providing broad ABI-level stability for high-level constructs is a significant and permanent burden on their design. It becomes an impediment to evolution, which is one of our stated goals.”

“An impediment to evolution” can be considered an understatement. If the committee can’t change library or language features the evolution of the language will come to an inevitable halt and leave plenty of room for other languages to take its place as the language that puts performance above all.

With the imminent release of C++20, many committee members started voicing their concern over the continued inexplicit support of a stable ABI and the risks it poses to the evolution of the language, as a result, the committee decided to take a series of polls during its last meeting (Prague) on breaking ABI. The results were discouraging.

The committee doesn’t promise stability forever and they do want to prioritize performance over backward compatibility, but they are not in favor of ABI breaking changes now or in C++23. In other words, there’s consensus about the risks that come with ABI stability but the committee isn’t ready to do anything about it.

The difficulty with this decision lies in the fact that the longer we maintain a stable ABI the harder it becomes to break it. The performance gap will continue to grow and the standard library will start losing its relevance (some might argue it already has) as 3rd-party libraries such as Boost and Folly continue to provide better alternatives to standard features.

The consensus in the community is that breaking ABI is the only way to keep the language relevant in the decades to come but no matter where you stand on this issue you should be concerned with the status quo. C++ users can’t rely on the language evolving and there is no guarantee for backward compatibility. Instead, we remain in limbo as the language grows in proportion to the problem that may derail it.


#### References:
<ul class="references">
    <li><sup>1</sup> <a href="http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p1863r0.pdf">P1863R1: ABI - Now or Never</a>
    <li><sup>2</sup> <a href="http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2020/p2137r0.html">P2137R0: Goals and priorities for C++</a>
</ul>`);

TinyMDEInstance.registerShortcut("ctrl+s", () => {
    console.log("Save document");
});